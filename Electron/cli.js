const { execSync, exec } = require("child_process");
const axios = require("axios");
const semver = require("semver");
const sudo = require('sudo-prompt');
const options = {
  name: 'Nelumbo'
};

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

const installBrew = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const zshInstalled = await checkShell();
      sudo.exec(`${zshInstalled ? "zsh" : "bash"} -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`, options, (error, stdout, stderr) => {
          if (error) {
            reject(error);
          }
          resolve();
        }
      );
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

const checkShell = async () => {
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
              await installBrew();
              sudo.execSync(
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
    return new Promise(async (resolve, reject) => {
      try {
        const zshAvailable = await checkShell();
        const shellToUse = zshAvailable ? 'zsh' : 'bash';        
        await prepDevnet(`${shellToUse} ./Electron/shell_scripts/prep_devnet_new.sh`);
        await startDaemon(`${shellToUse} ./Electron/shell_scripts/run_daemon.sh`)
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  },
  startMiner: async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const zshAvailable = await checkShell();
        const script = zshAvailable ? 'zsh ./Electron/shell_scripts/devnet_miner.sh' : 'bash ./Electron/shell_scripts/devnet_miner.sh';
        exec(script, (err) => {
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
  },
  stopLotus: async () => {
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
