require("dotenv").config();
const { execSync, exec } = require("child_process");
const axios = require("axios");
const semver = require("semver");
const home = require("os").homedir();
const fs = require("fs");
const path = require("path");
const isDev = require("electron-is-dev");
const { ExceptionlessClient } = require("exceptionless");
const client = ExceptionlessClient.default;
client.config.apiKey = process.env.EXCEPTIONLESS_KEY;
const fixPath = require("fix-path");
//  When we need sudo access, the below will create a native macOS prompt
// const sudo = require('sudo-prompt');
// const options = {
//   name: 'Nelumbo'
// };
let shellURL = isDev ? `./Electron/shell_scripts/` : path.join(process.resourcesPath, '/app/Electron/shell_scripts/');
const checkOnDependencies = async (dependency) => {
  fixPath();
  return new Promise(async (resolve, reject) => {
    try {
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
        const newerGo = semver.gte(targetGo, goV);
        if (newerGo);
        throw {
          status: "rejected",
          value: "go",
        };
      }
      const dep =
        dependency === "xcode"
          ? execSync("xcode-select -p")
          : execSync(`which ${dependency}`);

      resolve(dep.toString());
    } catch (error) {
      reject(dependency);
    }
  });
};

const checkShell = async () => {
  fixPath();
  return new Promise((resolve, reject) => {
    try {
      exec('which zsh', (err) => {
        if(err) {
          resolve(false)
        } else {
          resolve(true);
        }
      })
    } catch (error) {
      reject(error);
    }
  })
}

const prepDevnet = async (script) => {
  fixPath();
  return new Promise((resolve, reject) => {
    try {
      exec(script, (err, stdout, stderr) => {
        if(err) {
          reject(err);
        }        
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  })
}

const startDaemon = async (script) => {
  fixPath();
  return new Promise((resolve, reject) => {
    try {
      exec(script, (err, stdout, stderr) => {
        if(err) {
          reject(err);
        }       
      });
      setTimeout(() => {
        resolve();
      }, 3000) 
    } catch (error) {
      reject(error);
    }
  })
}

const stopMiner = async () => {
  fixPath();
  return new Promise((resolve) => {
    exec('lotus-miner stop');
    resolve();
  })
}

const stopDaemon = async () => {
  fixPath();
  return new Promise((resolve) => {
    exec('lotus daemon stop')
    resolve();
  })
}

const createWallet = () => {
  fixPath();
  return new Promise((resolve, reject) => {
    exec("lotus wallet new", (err, stdout) => {
      if(err) {
        reject(err);
      }
      resolve(stdout);
    })
  })
}

const fundWallet = (wallet) => {
  fixPath();
  return new Promise((resolve, reject) => {
    exec(`lotus send ${wallet.replace(/(\r\n|\n|\r)/gm, "")} 4999999`, (err) => {
      if(err) {
        reject(err);
      }
      resolve();
    })
  })
}

module.exports = {
  checkOnDependencies: async () => {
    try {
      const dependencies = [ 
        "brew",
        "xcode",
        "git",
        "go",
        "bzr",
        "jq",
        "pkgConfig",
        "cargo",
        "hwloc",
        "lotus"]
      // const [
      //   brew,
      //   xcode,
      //   git,
      //   go,
      //   bzr,
      //   jq,
      //   pkgConfig,
      //   cargo,
      //   hwloc,
      //   lotus,
      // ] = await Promise.allSettled([
      //   checkOnDependencies("brew"),
      //   checkOnDependencies("xcode"),
      //   checkOnDependencies("git"),
      //   checkOnDependencies("go"),
      //   checkOnDependencies("bzr"),
      //   checkOnDependencies("jq"),
      //   checkOnDependencies("pkg-config"),
      //   checkOnDependencies("cargo"),
      //   checkOnDependencies("hwloc"),
      //   checkOnDependencies("lotus"),
      // ]);

      const failedDependencies = [];
      for (const dep of dependencies) {
        try {
          await checkOnDependencies(dep);
        } catch (error) {
          failedDependencies.push(dep);
        }
      }
      // const failedDependencies = [
      //   brew,
      //   xcode,
      //   git,
      //   go,
      //   bzr,
      //   jq,
      //   pkgConfig,
      //   cargo,
      //   hwloc,
      //   lotus,
      // ].filter((d) => d.status === "rejected");
      
      return failedDependencies;
    } catch (error) {
      client.submitException(error);
      throw error;
    }
  },
  getLocalLotusVersion: async () => {
    fixPath();
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
    fixPath();
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
    fixPath();
    return new Promise(async (resolve, reject) => {
      try {
        for (const dep of dependencies) {
          switch (dep.reason) {
            case "xcode":
              console.log("Installing xcode tools");
              execSync("xcode-select --install");
              break;
            case "lotus":
              console.log("Lotus will be installed later...")
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
  startWorkers: async (existingRepo) => {
    fixPath();
    return new Promise(async (resolve, reject) => {
      try {
        const zshAvailable = await checkShell();
        const shellToUse = zshAvailable ? 'zsh' : 'bash';      
        await prepDevnet(`${shellToUse} ${shellURL}${existingRepo ? "prep_devnet_existing.sh" : "prep_devnet_new.sh"}`);
        await startDaemon(`${shellToUse} ${shellURL}run_daemon.sh`)
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  },
  startMiner: async () => {
    fixPath();
    return new Promise(async (resolve, reject) => {
      try {
        const zshAvailable = await checkShell();
        const script = zshAvailable ? `zsh ${shellURL}devnet_miner.sh` : `bash ${shellURL}devnet_miner.sh`;
        exec(script, (err, stdout, stderr) => {
          if(err) {
            reject(err);
          }
          if(stderr) {
            reject(stderr)
          }
        });
        setTimeout(() => {
          resolve();
        }, 5000) 
      } catch (error) {
        reject(error);
      }                                                                                                                                 
    })
  },
  stopLotus: async () => {
    fixPath();
    return new Promise((resolve, reject) => {
      try {
        exec('lotus daemon stop && lotus-miner stop', (err) => {
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
    fixPath();
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
  }, 
  upgradeLotus: async () => {
    fixPath();
    return new Promise(async (resolve, reject) => {
      try {
        const zshAvailable = await checkShell();
        const script = zshAvailable ? `zsh ${shellURL}upgrade_lotus.sh` : `bash ${shellURL}upgrade_lotus.sh`;
        exec(script, (err) => {
          if(err) {
            reject(err)
          }
          resolve();
        })
      } catch (error) {
        reject(error);
      }
    })
  }, 
  stopLotus: async () => {
    fixPath();
    await stopMiner();
    await stopDaemon();
    return;
  }, 
  getLotusToken: async () => {
    fixPath();
    return new Promise((resolve, reject) => {
      exec('cat ~/.lotus/token', (err, stdout, stderr) => {
        if(err) {
          reject(err);
        }
        resolve(stdout);
      })
    })
  },
  createWallets: async () => {
    fixPath();
    try {
      let wallets = 0;
      let walletList = []
      while(wallets < 9) {
        wallets++;
        const wallet = await createWallet();
        if(wallet.length > 0) {
          walletList.push(wallet);
        }
      }

      for(const w of walletList) {
        await fundWallet(w);
      }
      return;
    } catch (error) {
      throw error;
    }
  }, 
  updateConfig: async (config) => {
    fixPath();
    try {
      return new Promise(async (resolve, reject) => {
        exec('touch ~/.lotus/config.toml', async (err, stdout, stderr) => {
          if(err || stderr) {
            resolve(false)
          } else {
            try {
              await fs.writeFileSync(`${home}/.lotus/config.toml`, config);
              resolve();
            } catch (error) {
              reject(error);
            }
          }
        })
      })      
    } catch (error) {
      throw error;
    }
  }, 
  startIPFS: async () => {
    fixPath();
    return new Promise((resolve, reject) => {
      try {
        exec("ipfs daemon", (err, stdout, stderr) => {
          if(err) {
            reject(err);
          }
          //  Give it 2.5 seconds for the daemon to start
          setTimeout(() => {
            resolve();
          }, 2500)
        })
      } catch (error) {
        reject(error);
      }
    })
  }
};
