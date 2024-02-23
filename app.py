#b4fa254dfb694db2bf20340740580af8
#f6e5aba8393f4fc385c6a91ce91599a5

from flask import Flask, render_template, request, session, redirect, url_for



app = Flask(__name__)
app.config['SESSION_COOKIE_NAME'] = 'Spotify Cookie'
app.secret_key = 'dsfhku324rdf*$&@(&*($GF&KUGF73$))'
TOKEN_INFO = 'token'
code = None


@app.route('/')
def index():
    code = session.get('code', None)
    session.clear()
    return render_template('index.html', code=code)

@app.route('/create/')
def create():
    return render_template('creator.html')

@app.route('/feedback/')
def feedback():
    return render_template('feedback.html')

@app.route('/callback/')
def callback():
    session['code'] = request.args.get('code', default=None)
    return redirect(url_for('index'))

@app.route('/profcallback/')
def profcallback():
    return redirect(url_for('create'))


if __name__ == "__main__":
    app.run(debug=True, port=4321)