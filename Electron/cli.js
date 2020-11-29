const { execSync, exec } = require("child_process");
const axios = require("axios");
const semver = require("semver");

const clean = async () => {
  return new Promise((resolve, reject) => {
    try {
      exec(`cd ~/lotus && make clean`, (err, stdout, stderr) => {
        if(err) {
          reject(err)
        } else {
          resolve();
        }
      })
    } catch (error) {
      reject(error);
    }
  })
}

const make = async () => {
  return new Promise((resolve, reject) => {
    try {
      exec("cd ~/lotus && make all", (err, stdout, stderr) => {
        if(err) {
          reject(err);
        } else {
          resolve();
        }
      })
    } catch (error) {
      reject(error);
    }
  })
}

const install = async () => {
  return new Promise((resolve, reject) => {
    try {
      exec("cd ~/lotus && make install", (err, stdout, stderr) => {
        if(err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  })
}

const checkOnDependencies = async (dependency) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dep =
        dependency === "xcode"
          ? execSync("xcode-select -p")
          : execSync(`which ${dependency}`);
      if (dependency === "go") {
        const targetGo = "1.15.5";
        const goVersion = execSync("go version");
        const goRootVersion = "1";
        const goMainVersion = goVersion
          .toString()
          .split("go1.")[1]
          .split(" ")[0];
        const goSubVersion = goVersion.toString().split(".")[2].split(" ")[0];
        const goV = `${goRootVersion}.${goMainVersion}`;
        console.log(goV);
        const newerGo = semver.gte(targetGo, goV);
        if (newerGo);
        throw {
          status: "rejected",
          value: "go",
        };
      }
      resolve(dep.toString());
    } catch (error) {
      reject(dependency);
    }
  });
};

const exportPaths = async () => {
  return new Promise((resolve, reject) => {
    try {
      exec('rm -rf ~/.lotus && rm -rf ~/.lotusminer', (err) => {
        if(err) {
          reject(err);
        } else {
          exec('export CGO_CFLAGS_ALLOW="-D__BLST_PORTABLE__"', (err, stdout, stderr) => {
            if(err) {
              reject(err);
            } else {
              exec('export CGO_CFLAGS="-D__BLST_PORTABLE__"', (err, stdout, stderr) => {
                if(err) {
                  reject(err);
                } else {
                  exec('export LOTUS_PATH=~/.lotusDevnet', (err, stdout, stderr) => {
                    if(err) {
                      reject(err);
                    } else {
                      exec('export LOTUS_MINER_PATH=~/.lotusminerDevnet', (err, stdout, stderr) => {
                        if(err) {
                          reject(err);
                        } else {
                          resolve();
                        }
                      })
                    }
                  })
                }
              })
            }
          });
        }
      })
    } catch (error) {
      reject(error);
    }
  })
}

const make2k = async () => {
  return new Promise((resolve, reject) => {
    try {
      exec("cd ~/lotus && make 2k", (err, stdout, stderr) => {
        if(err) {
          reject(err);
        } else {
          resolve();
        }
      })
    } catch (error) {
      reject(error);
    }
  })
}

const exportEnv = async () => {
  return new Promise((resolve, reject) => {
    try {
      exec('export LOTUS_SKIP_GENESIS_CHECK=_yes_', (err, stdout, stderr) => {
        if(err) {
          reject(err);
        } else {
          resolve();
        }
      })
    } catch (error) {
      reject(error);
    }
  })
}

const fetchParams = async () => {
  return new Promise((resolve, reject) => {
    try {
      exec('cd ~/lotus && ./lotus fetch-params 2048', (err, stdout, stderr) => {
        if(err) {
          reject(err);
        } else {
          resolve();
        }
      })
    } catch (error) {
      reject(error);
    }
  })
}

const preSeal = async () => {
  return new Promise((resolve, reject) => {
    try {
      exec('cd ~/lotus && ./lotus-seed pre-seal --sector-size 2KiB --num-sectors 2', (err, stdout, stderr) => {
        if(err) {
          reject(err);
        } else {
          resolve();
        }
      })
    } catch (error) {
      reject(error);
    }
  })
}

const localNet = async () => {
  return new Promise((resolve, reject) => {
    try {
      exec('cd ~/lotus && ./lotus-seed genesis new localnet.json', (err, stdout, stderr) => {
        if(err) {
          reject(err);
        } else {
          resolve();
        }
      })
    } catch (error) {
      reject(error);
    }
  })
}

const addMiner = async () => {
  return new Promise((resolve, reject) => {
    try {
      exec('cd ~/lotus && ./lotus-seed genesis add-miner localnet.json ~/.genesis-sectors/pre-seal-t01000.json', (err, stdout, stderr) => {
        if(err) {
          reject(err);
        } else {
          resolve();
        }
      })
    } catch (error) {
      reject(error);
    }
  })
}

const createGenesis = async () => {
  return new Promise((resolve, reject) => {
    try {
      exec('cd ~/lotus && ./lotus daemon --lotus-make-genesis=devgen.car --genesis-template=localnet.json --bootstrap=false', (err, stdout, stderr) => {
        if(err) {
          reject(err);
        } 
      });
      //  Giving the chain some time to start up
      setTimeout(() => {
        resolve();
      }, 2500)
    } catch (error) {
      reject(error)
    }
  })
}

const importWallet = async () => {
  return new Promise((resolve, reject) => {
    try {
      exec('cd ~/lotus && ./lotus wallet import --as-default ~/.genesis-sectors/pre-seal-t01000.key', (err, stdout, stderr) => {
        if(err) {
          reject(err);
        } else {
          resolve();
        }
      })
    } catch (error) {
      reject(error);
    }
  })
}

const initMiner = async () => {
  return new Promise((resolve, reject) => {
    try {
      exec('rm -rf ~/.lotusminer', (err, stdout, stderr) => {
        if(err) {
          reject(err);
        } else {          
          exec('cd ~/lotus && ./lotus-miner init --genesis-miner --actor=t01000 --sector-size=2KiB --pre-sealed-sectors=~/.genesis-sectors --pre-sealed-metadata=~/.genesis-sectors/pre-seal-t01000.json --nosync', {maxBuffer: 1024 * 500}, (err, stdout, stderr) => {
            if(err) {
              reject(err);
            } else {
              resolve();
            }
          })
        }
      })      
    } catch (error) {
      reject(error);
    }
  })
}

const startMiner = async () => {
  return new Promise((resolve, reject) => {
    try {
      exec('cd ~/lotus && ./lotus-miner run --nosync', (err) => {
        if(err) {
          reject(err);
        }
      });
      //  Giving some time for the miner to start
      setTimeout(() => {
        resolve();
      }, 2500)
    } catch (error) {
      reject(error);
    }
  })
}

module.exports = {
  checkOnDependencies: async () => {
    try {
      const [
        brew,
        xcode,
        git,
        go,
        bzr,
        jq,
        pkgConfig,
        cargo,
        hwloc,
        lotus,
      ] = await Promise.allSettled([
        checkOnDependencies("brew"),
        checkOnDependencies("xcode"),
        checkOnDependencies("git"),
        checkOnDependencies("go"),
        checkOnDependencies("bzr"),
        checkOnDependencies("jq"),
        checkOnDependencies("pkg-config"),
        checkOnDependencies("cargo"),
        checkOnDependencies("hwloc"),
        checkOnDependencies("lotus"),
      ]);
      const failedDependencies = [
        brew,
        xcode,
        git,
        go,
        bzr,
        jq,
        pkgConfig,
        cargo,
        hwloc,
        lotus,
      ].filter((d) => d.status === "rejected");
      console.log(failedDependencies);
      return failedDependencies;
    } catch (error) {
      throw error;
    }
  },
  getLocalLotusVersion: async () => {
    return new Promise((resolve, reject) => {
      try {
        const lotus = execSync("lotus --version");
        resolve(lotus.toString().split("version ")[1].split("+")[0]);
      } catch (error) {
        reject("lotus");
      }
    });
  },
  getCurrentLotusVersion: async () => {
    try {
      //
      const releases = await axios.get(
        "https://api.github.com/repos/filecoin-project/lotus/releases"
      );
      const mappedAndFilteredReleases = releases.data
        .map((r) => r.name)
        .filter((release) => !release.includes("-") && !release.includes("rc"))
        .map((rl) => rl.split("v")[1]);

      return mappedAndFilteredReleases;
    } catch (error) {
      throw error;
    }
  },
  installDependencies: async (dependencies) => {
    return new Promise(async (resolve, reject) => {
      try {
        for (const dep of dependencies) {
          switch (dep.reason) {
            case "brew":
              console.log("Installing brew");
              execSync(
                '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
              );
              break;
            case "xcode":
              console.log("Installing xcode tools");
              execSync("xcode-select --install");
              break;
            case "lotus":
              console.log("Installing lotus");
              execSync("rm -rf ~/lotus");
              console.log("Chainging directory and cloning...");
              execSync(
                "cd ~/ && git clone https://github.com/filecoin-project/lotus.git"
              );
              console.log("Switching into lotus directory & installing...");
              console.log("Cleaning...");
              await clean();
              console.log("Making...");
              await make();
              console.log("installing...");
              await install();
              break;
            case "cargo":
              try {
                execSync("brew install rustup");
              } catch (error) {
                if (error.message.includes("already installed")) {
                  console.log("Upgrading rust");
                  execSync("brew upgrade rustup");
                }
              }
            default:
              console.log(`Installing ${dep.reason}`);
              try {
                execSync(`brew install ${dep.reason}`);
              } catch (error) {
                if (error.message.includes("already installed")) {
                  console.log(`Upgrading ${dep.reason}`);
                  execSync(`brew upgrade ${dep.reason}`);
                }
              }
              break;
          }
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  },
  startWorkers: async () => {
    try {
      console.log("Exporting paths...");
      await exportPaths();
      console.log("Making 2k sectors...");
      await make2k();
      console.log("Exporting ENV...");
      await exportEnv();
      console.log("Fetching params...");
      await fetchParams();        
      console.log("Setting up sectors...");
      await preSeal();    
      console.log("Creating local net...");
      await localNet();
      console.log("Adding miner...");
      await addMiner();
      console.log("Creating genesis block...");
      await createGenesis();
      return;
    } catch (error) {
      throw error;
    }
  },
  startMiner: async () => {
    try {
      console.log("Importing miner...");
      await importWallet();
      console.log("Initializing miner...");
      await initMiner();
      console.log("Starting miner...");
      await startMiner();
      return;
    } catch (error) {
      throw error;
    }
  },
  stopLotus: async () => {
    return new Promise((resolve, reject) => {
      try {
        exec('lotus daemon stop', (err) => {
          if(err) {
            reject(err);
          } else {
            resolve();
          }
        })
      } catch (error) {
        reject(error);
      }
    })    
  }, 
  checkLotusState: async () => {
    return new Promise((resolve, reject) => {
      try {
        exec('lotus net listen', (err, stdout, stderr) => {
          if(err || stderr) {
            resolve(false)
          } else {
            resolve(true)
          }
        })
      } catch (error) {
        resolve(false)
      }
    })
  }
};
