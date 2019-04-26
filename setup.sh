wget http://download.tensorflow.org/models/deeplabv3_mnv2_pascal_train_aug_2018_01_29.tar.gz
wget http://download.tensorflow.org/models/deeplabv3_pascal_train_aug_2018_01_04.tar.gz

mkdir -p public/input
mkdir -p public/output

mkdir -p models
mkdir -p models/mobile_net_model
mkdir -p models/xception_model
tar xvzf deeplabv3_mnv2_pascal_train_aug_2018_01_29.tar.gz -C models/mobile_net_model --strip=1
tar xvzf deeplabv3_pascal_train_aug_2018_01_04.tar.gz -C models/xception_model --strip=1

rm deeplabv3_mnv2_pascal_train_aug_2018_01_29.tar.gz
rm deeplabv3_pascal_train_aug_2018_01_04.tar.gz
