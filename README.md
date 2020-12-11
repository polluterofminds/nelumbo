# Nelumbo 

Nelumbo is a one-click, development blockchain for Filecoin that you can run on your Mac. Rather than spending time with dependencies, version management, and command-line difficulties, you can launch a development version of the Filecoin Lotus blockchain. This let's you get to the important stuff faster—building.

## Project Status  

Nelumbo is under active development. Contributions are welcome. Please open issues, create pull requests, and reach out if you have questions. 

The current state includes the following: 

* UI that prompts Homebrew install  
* UI to install and run Lotus  
* UI to indicate Lotus is running  
* UI to allow Lotus upgrades

## Requirements  

While Nelumbo tries to abstract away all of the dependency installation requirements, there is one dependency that is required. Users will need to install [Homebrew](https://brew.sh).

##  Who is behind this project  

Justin Hunter ([polluterofminds](https://polluterofminds.com)) is building this. He has been working on Filecoin storage client development since the early days of Testnet. This project solves a big problem for him, and it will surely solve a big problem for you if you're building storage client apps. 

##  Run it locally

1. Clone the repo - `git clone https://github.com/polluterofminds
2. /nelumbo`  
3. Change into directory - `cd nelumbo`  
4. Install dependencies - `npm install`  
4. Run - `npm run dev`  

