# 鈴木貴之Assignment README

## サンプルアプリ
http://tsdr-strava.herokuapp.com/

## Configuration

* settings.js（ご自身の環境に合わせて設定してください）

```
cp settings.example.js settings.js
```

* ローカル環境で起動（node version 0.12.X）

```
npm install
gulp
```

## 設計方針
####フレームワーク
######サーバサイド → nodejs
* 採用理由 
	* サーバ側は基本的にはstrava APIとクライアントサイドの橋渡しをするだけ。この処理を手早く構築できそうだったので
	* あまり触ったことがなかったので勉強の意味も含め


###### クライアントサイド → Angularjs
* 採用理由 
	* 使い慣れていたため

#### ディレクトリ構成

```
Project
 ├ node_modules   nodeのmodule
 ├ public       クライアントサイドのコンパイル済ソースコード
 ├ server          サーバサイドのソースコード
 └ source          クライアントサイドのソースコード
```

#### 設計のポイント
グラフ描画のために取得データしたを加工する際、
データが多いと処理が重くなる可能性があるため、
webworkerを使用して別スレッドに処理を投げて負荷を分散させるようにしました。


## Dependencies

* サーバ側

 
| package名 | 用途 |
|:-----------|------------:|
| body-parser		|リクエストボディのパース|
| bower     		|ライブラリのバージョン管理|
| cookie-parser	|クッキーのパース|
| ejs       		|テンプレートエンジン|
| express    		|フレームワーク|
| express-session |セッションの使用|
| gulp    			|タスクランナー|
| multer    		|ファイルアップロード|
| request    		|HTTPリクエスト|

* フロント側

| package名 | 用途 |
|:-----------|------------:|
| angular				|フレームワーク|
| angular-cookies		|クッキーの使用|
| angular-bootstrap	|デザインテンプレート|
| angular-ui-router  	|ルーティング|
| angular-breadcrumb	|パンくずリスト|
| angular-nvd3 		|グラフの描画|
| lodash    			|utility|
| bootstrap    		|デザインテンプレート|
| font-awesome    	|webフォント|




