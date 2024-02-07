#b4fa254dfb694db2bf20340740580af8
#f6e5aba8393f4fc385c6a91ce91599a5
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import time


app = Flask(__name__)
app.config['SESSION_COOKIE_NAME'] = 'Spotify Cookie'
app.secret_key = 'dsfhku324rdf*$&@(&*($GF&KUGF73$))'
TOKEN_INFO = 'token'

# @app.route ('/')
# def index():
#     return render_template('tesst.html')


# @app.route('/callback')
# def callback():
#     return redirect(url_for('index'))

@app.route('/')
def index():
    code = session.get('code', None)
    session.clear()
    print(code)
    return render_template('index.html', code=code)


@app.route('/create/')
def create():
    code = session.get('code', None)
    print(code)
    return render_template('creator.html', code=code)

@app.route('/callback/')
def callback():
    session['code'] = request.args.get('code')
    return redirect(url_for('index'))

@app.route('/profcallback/')
def profcallback():
    #session['code'] = request.args.get('code')
    return redirect(url_for('create'))

# def create_auth():
#     return SpotifyOAuth(
#         client_id="b4fa254dfb694db2bf20340740580af8",
#           client_secret="f6e5aba8393f4fc385c6a91ce91599a5",
#             redirect_uri='http://localhost:4321/callback',
#             scope="user-library-read user-read-private user-read-email")

# @app.route('/')
# def index():
#     session.clear()
#     print('AJSFDAKKJDSAFDKSALFHUIAKJH')
#     return redirect(create_auth().get_authorize_url())

# @app.route('/callback/')
# def callback_page():
#     session.clear()
#     code = request.args.get('code')
#     token_info = create_auth().get_access_token(code)
#     session[TOKEN_INFO] = token_info
#     return redirect(url_for('playlist'))
#     # ...

# @app.route('/playlist/')
# def playlist():
#     print(session[TOKEN_INFO])
#     try:
#         token = get_token()
#     except:
#         print(  "USER NOT LOGGED IN ")
#         return redirect('/')
    
#     sp = spotipy.Spotify(auth=token['access_token'])
#     return render_template('playlist.html', account=sp)

# def get_token():
#     token = session.get(TOKEN_INFO, None)
#     if not token:
#         redirect(url_for('index'))

#     now = int(time.time())
#     if token['expires_at'] - now < 60:
#         spotify_auth = create_auth()
#         token = spotify_auth.refresh_access_token(token['refresh_token'])
#     return token

if __name__ == "__main__":
    app.run(debug=True, port=4321)