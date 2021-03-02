npm install
npm run build
pushd test-app
npm install
popd
npm link
pushd test-app
npm link feathers-transport-mqtt
popd
