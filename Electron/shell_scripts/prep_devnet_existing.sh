mkdir ~/.tempLotus && 
mv ~/.lotus/config.toml ~/.tempLotus/config.toml && 
rm -rf ~/.lotus && 
mkdir ~/.lotus && 
mv ~/.tempLotus/config.toml ~/.lotus/config.toml && 
rm -rf ~/.tempLotus &&
rm -rf ~/.lotusminer &&
cd ~/lotus && 
export CGO_CFLAGS_ALLOW="-D__BLST_PORTABLE__" && 
export CGO_CFLAGS="-D__BLST_PORTABLE__" && 
cd ~/lotus && make 2k && 
export LOTUS_SKIP_GENESIS_CHECK=_yes_ && 
cd ~/lotus && ./lotus fetch-params 2048 && 
cd ~/lotus && ./lotus-seed pre-seal --sector-size 2KiB --num-sectors 2 && 
cd ~/lotus && ./lotus-seed genesis new localnet.json && 
cd ~/lotus && ./lotus-seed genesis add-miner localnet.json ~/.genesis-sectors/pre-seal-t01000.json