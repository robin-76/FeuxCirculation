# Feux Circulation

- Année : M2 IWOCS
- Sujet : Docker

## Auteur(s)

|Nom|Prénom|
|--|--|
| *BOURGEAUX* | *Maxence*|
| *GUYOMAR* | *Robin* |

# Description

Projet Arduino qui consiste à gérer l'automatisation de feux de ciruculation dans un carrefour à l'aide d'un arduino uno 
et d'une page web générée par ExpressJS.

## Installation

On commence par installer les dépendances :

    npm i

Puis on lance le projet :

    npm start

Pour un problème de permissions du Arduino : 

    ls /dev/ttyACM0

    sudo chmod a+rw /dev/ttyACM0

