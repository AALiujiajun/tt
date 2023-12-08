@echo init SUBMODULE
@echo this will revert all submodule and update them to new

git submodule init
git submodule update


@echo update ttapi_interface
cd ttapi_interface
git checkout . 
git switch master
git pull
cd ..

@echo update ttapi_impl_web
cd ttapi_impl_web
git checkout . 
git switch master
git pull
cd ..

@echo update ttapi_layer2
cd ttapi_layer2
git checkout . 
git switch master
git pull
cd ..


@echo update ttapi_layer2_test
cd ttapi_layer2_test
git checkout . 
git switch master
git pull
cd ..

@echo Done.
@echo check if have errors
@pause