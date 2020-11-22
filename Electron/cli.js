const { execSync, exec } = require('child_process');

const checkOnDependencies = async (dependency) => {
  return new Promise((resolve, reject) => {
    try {
      const dep = dependency === 'xcode' ? execSync('xcode-select -p') : execSync(`which ${dependency}`);
      resolve(dep.toString());
    } catch (error) {
      reject(dependency);
    }
  })  
}

module.exports = {
  checkOnDependencies: async () => {
    try {
      const [xcode, git, go, bzr, jq, pkgConfig, rustup, hwloc, lotus] = await Promise.allSettled([
        checkOnDependencies('xcode'),
        checkOnDependencies('git'),
        checkOnDependencies('go'),
        checkOnDependencies('bzr'),
        checkOnDependencies('jq'),
        checkOnDependencies('pkg-config'),
        checkOnDependencies('rustup'),
        checkOnDependencies('hwloc'),
        checkOnDependencies('lotus')
      ]);
      const failedDependencies = [xcode, git, go, bzr, jq, pkgConfig, rustup, hwloc, lotus].filter((d) => d.status === 'rejected');
      return failedDependencies;
    } catch (error) {
      throw error;
    }
  }
}