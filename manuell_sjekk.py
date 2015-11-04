#!/usr/bin/env python3
import re
from flask import Flask, g, redirect, render_template, request, url_for
from sqlite3 import connect


app = Flask(__name__)

DATABASE = 'artikler.db'

def connect_db():
    return connect(DATABASE)

def get_db():
    db = getattr(g, '_database', None)
    if not db:
        db = g._database = connect_db()
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db:
        db.close()

def query_db(query, args=()):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return rv

articles = {}

@app.before_first_request
def setup():
    global articles
    arts = query_db(
        'SELECT docid, title, body '   +
        'FROM articles '  +
        'WHERE articles ' +
        'MATCH "(lofot* OR vesterål* OR senja)' +
        ' AND (olje* OR konsekvens* OR petroleum* OR vern*)" ' +
        'ORDER BY docid');
    for i in range(len(arts)):
        docid, title, body = arts[i]
        articles[docid] = {'docid' : docid,
                           'title' : title,
                           'body' : body,
                           'prev' : arts[(i-1)%len(arts)][0],
                           'next' : arts[(i+1)%len(arts)][0]}

    arts = query_db('SELECT docid FROM oljeleting')
    for docid, in arts:
        articles[docid]['saved'] = True

@app.add_template_filter
def mark_search_words(line):
    line = re.sub(r'(?i)\b(lofot\w*|vesterål\w*|senja)\b',
                  '<span>\\1</span>', line)
    line = re.sub(r'(?i)\b(olje\w*|konsekvens\w*|petroleum\w*|\w*vern\w*)\b',
                  '<span>\\1</span>', line)
    return line

@app.route('/save/<int:did>')
def save(did):
    global articles
    db = get_db()
    cursor = db.cursor()
    article = articles[did]
    cursor.execute('INSERT OR REPLACE INTO oljeleting VALUES (?)',
                   (article['docid'],))
    cursor.close()
    db.commit()
    article['saved'] = True
    articles[did] = article
    return redirect(url_for('article', did=article['next']))

@app.route('/remove/<int:did>')
def remove(did):
    global articles
    db = get_db()
    cursor = db.cursor()
    article = articles[did]
    cursor.execute('DELETE FROM oljeleting WHERE docid=?', (did,))
    return redirect(url_for('article', did=article['next']))


@app.route('/<int:did>')
def article(did):
    global articles
    return render_template('article.xhtml', article=articles[did])

@app.route('/')
def main():
    db = get_db()
    docids = query_db('SELECT docid FROM oljeleting ORDER BY docid DESC LIMIT 1')
    if not docids[0]:
        global articles
        did = sorted(list(articles))[0]
    else:
        did, = docids[0]

    return redirect(url_for('article', did=did))

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
