cd ~/lotus && ./lotus wallet import --as-default ~/.genesis-sectors/pre-seal-t01000.key && 
cd ~/lotus && ./lotus-miner init --genesis-miner --actor=t01000 --sector-size=2KiB --pre-sealed-sectors=~/.genesis-sectors --pre-sealed-metadata=~/.genesis-sectors/pre-seal-t01000.json --nosync
cd ~/lotus && ./lotus-miner run --nosync