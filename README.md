npm install
npm run build
npm run start

if that's not working, then do this and then run from npm run build

npm i -S {react,react-dom}
npm i -D babel-{core,loader} babel-preset-react
npm i -D webpack webpack-dev-server html-webpack-plugin