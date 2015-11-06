#!/usr/bin/env python3
import re
import os
from flask import Flask, g, redirect, render_template, url_for  # request,
# from sqlite3 import connect
from pymongo import MongoClient

app = Flask(__name__)

# DATABASE = 'artikler.db'
#
# def connect_db():
#     return connect(DATABASE)
#
# def get_db():
#     db = getattr(g, '_database', None)
#     if not db:
#         db = g._database = connect_db()
#     return db
#
# @app.teardown_appcontext
# def close_connection(exception):
#     db = getattr(g, '_database', None)
#     if db:
#         db.close()

# def query_db(query, args=()):
#     cur = get_db().execute(query, args)
#     rv = cur.fetchall()
#     cur.close()
#     return rv


def get_mongo_db():
    client = MongoClient('mongodb://localhost:27017/')
    db = client.hand_curated_articles
    mongo_articles = db.articles
    return mongo_articles


def create_art(text, cat, filename, source="NAK"):
    f1 = "file://%s" % filename
    return {"text": text.strip(), "source": source,
            "filename": f1, "category": cat}


def art_is_ok(art):
    for k, v in art.items():
        if v is None or v is False:
            return False
    return True

articles = {}
docids = []

@app.before_first_request
def setup():
    global articles
    # loop over all docs and fetch path as id
    global docids
    cat = "SOS"  # ULY VIT VEAR KRIM POL "HVER" "KULT" "SPO"  # "OKO"
    start_folder = "../newsCat/NAK_2015_SORTED/%s/" % cat
    for i in os.listdir(start_folder):
        if i.endswith(".xml") or i.endswith(".txt"):
            docids.append(start_folder+i)

    # do this again, fetch richer data, incl next/prev from above list
    for i in docids:  # skip first & last one
        with open(i, "r") as f:
            doc = f.read()
            articles[i] = {'docid': i,
                           'cat': cat,
                           'title': doc[:30],
                           'body': doc,
                           'index': docids.index(i),
                           'prev': (docids.index(i)-1) % len(docids),  # docids[(docids.index(i)-1) % len(docids)]
                           'next': (docids.index(i)+1) % len(docids)
                           }
# @app.add_template_filter
# def mark_search_words(line):
#     line = re.sub(r'(?i)\b(lofot\w*|vesterål\w*|senja)\b',
#                   '<span>\\1</span>', line)
#     line = re.sub(r'(?i)\b(olje\w*|konsekvens\w*|petroleum\w*|\w*vern\w*)\b',
#                   '<span>\\1</span>', line)
#     return line

@app.route('/save/<int:did>')
def save(did):
    global articles
    global docids
    mongo_arts = get_mongo_db()

    print(articles[docids[did]])

    art = create_art(articles[docids[did]]['body'],
                     articles[docids[did]]['cat'],
                     filename=articles[docids[did]]['docid'],
                     source="NAK")
    if art_is_ok(art):
        mongo_arts.insert_one(art)
    # cursor.close()
    # db.commit()
    return redirect(url_for('article', did=articles[docids[did]]['next']))

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
    global docids
    print(articles[docids[did]])
    return render_template('article_2.xhtml', article=articles[docids[did]])

@app.route('/')
def main():
    # print(start_folder+i)
    # docids = query_db('SELECT docid FROM oljeleting ORDER BY docid DESC LIMIT 1')
    # if not docids[0]:
    #     global articles
    #     did = sorted(list(articles))[0]
    # else:
    #     did, = docids[0]
    global articles
    did = 0

    return redirect(url_for('article', did=did))

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
