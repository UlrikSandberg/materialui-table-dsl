# Docker run option
First option is to use the accomodating docker file

Build image:
```
docker build . -t tabledsl:1.0
```

Run image:
```
docker run -d -p 23230:80 tabledsl:1.0
```

# Manual run option
1. Install node on system
2. run the .sh file which will install the required node modules and start the react app

# IMPORTANT!!!
IF running manually make sure that the node_modules folder exists by running npm install in the folder containing package.json file. ALSO if it doesn't work my script might miss out on react installations for this reason try in a different folder outside the project and run "npx create-react-app test" to see if all the necessary tools are installed to scafold a react application.

# Structure
main application is inside the src folder, more specifically everything start from index.tsx which mounts App.tsx

App.tsx is inside the component folder and showcases an example of the implemented dsl

The dsl is contained inside the table folder which consists of two folders namely builders and the metamodel.

The metamodel consists of the following hierachy:

The MetaTable owns MetaRows and HeaderColumns, the MetaRow owns regular columns, and there exists a heirachy of columns.
As the domain happend to fall on react and they advice to do component as what is known as functional components the different
components actually looks like functions, however they work as a first-class citizen and is equally valid as a class just ligther.
Likewise, instead of having a heritage heirachy of an abstract basecolumn class which is extended through regular class heritage, the 
functional components exhibits heritage by rendering them selves as children inside more abstract components.

# Disclaimer
1. I'm no UX designer and for that reason to make it feel nicer i have made extensive use of the material-ui react library for nice ui components and styling.
2. The overall design and inspiration for many of the ideas such as dropdown, searching etc are also inspired from material-ui examples of tables, (however only as an inspiration for functionality no code)
3. Likewise the sorting algorithm was lended as time was short and i really wanted a working proof of concept


