

import json
import numpy as np
from flask import Flask, jsonify, request, make_response
from gensim.models import Word2Vec
from flask_api import FlaskAPI, status, exceptions, response
from flask_cors import CORS, cross_origin
threshold  = 0.7
app = FlaskAPI(__name__)
cors = CORS(app, send_wildcard=True)
app.config["CORS_HEADERS"] = "Content-Type"
# app.config["A"]
svModel = Word2Vec.load("D:\Machine_Learning_Projects\word2VecSwedish.model", mmap="r")
esModel = Word2Vec.load("D:\Machine_Learning_Projects\word2VecSpanish.model", mmap="r")
def cosine_similarity(l1, l2, model):
    v1 = model.wv[l1[0]]
    v2 = model.wv[l2[0]]
    for i in l1[1:]:
        v1 = np.add(v1, model.wv[i])
    for i in l2[1:]:
        v2 = np.add(v2, model.wv[i])
    return np.dot(v1, v2)/(np.linalg.norm(v1)*np.linalg.norm(v2))

def wordInDict(words, model, dict, lang):
    for index, word in enumerate(words):
        word = word.lower()
        if len(word.split(" ")) > 1:
            for w in word.split(" "):
                if w not in model:
                    if lang not in dict:
                        dict[lang] = []
                    dict[lang].append(index)
                    break
        elif word not in model:
            if lang not in dict:
                dict[lang] = []
            dict[lang].append(index)

@cross_origin()
@app.route("/glossary", methods=["POST"])
def glossary():
    targetWords = request.args.get("targetWord").split(" ")
    words = request.args.get("word").split(" ")
    language = request.args.get("la")
    match language:
        case "Spanish":
            try:
                similarity = cosine_similarity(words, targetWords, esModel)
                return {
                    "Similarity": str(similarity),
                    "Accepted": str(threshold <= similarity)
                }
            
            except KeyError:
                return make_response("Key not found", 400)
            
        case "Swedish":
            try:
                similarity = cosine_similarity(words, targetWords, svModel)
                return {
                    "Similarity": str(similarity),
                    "Accepted": str(threshold <= similarity)
                }
            
            except KeyError:
                return make_response("Key not found", 400)
        case _:
            raise LanguageUnsupported
@cross_origin()            
@app.route("/languages", methods=["GET"])
def languages():
    return ["Swedish", "Spanish"]
@cross_origin()
@app.route("/validate", methods=["POST"])
def validate():
    words = request.json
    app.logger.debug(words)
    out = {}
    for i in words:
        match i:
            case "Swedish":
                wordInDict(words[i], svModel.wv, out, i)
            case "Spanish":
                wordInDict(words[i], esModel.wv, out, i)
    #Change content type
    app.logger.debug(repr(out))
    return out

@app.route("/most_similar", methods=["POST"])
def mostSimilar():
    words = request.args.get("word")
    language = request.args.get("la")
    match language:
        case "Spanish":
            try:
                return esModel.wv.most_similar(positive=[words])
                
            
            except KeyError:
                return make_response("Key not found", 400)
            
        case "Swedish":
            try:
                
                return svModel.wv.most_similar(positive=[words])
            except KeyError:
                return make_response("Key not found", 400)
        case _:
            raise LanguageUnsupported

class LanguageUnsupported(exceptions.APIException):
    status_code = 400
    detail = None
app.run(debug=True)

