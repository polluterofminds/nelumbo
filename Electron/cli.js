module.exports = {
  checkOnDependencies: () => {
    try {
      console.log("Checking on dependencies")
    } catch (error) {
      throw error;
    }
  }
}