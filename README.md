Grocer
======

*Front end asset manager*

[Wiki](https://github.com/danstocker/grocer/wiki)

[Reference](http://danstocker.github.io/grocer/)

The purpose of Grocer is to provide an API to

1. build, manage, and initialize Grunt config files based on a manifest file
2. impose modularity on the application, each module having an optional main object (function, class, etc.) that the application can invoke when the module is loaded

Manifest structure
------------------

The top level defines the modules. Within each module, there is a container for assets, separated by function (eg. JavaScript or CSS). Optionally, modules might define a `classPath`, that identifies the path (relative to the global object) that the application is supposed to invoke after loading the module.

    {
        "libraries": {
            "assets": {
                "js": [ "src/jquery.js" ]
            }
        },
        "common": {
            "assets": {
                "js": [ "src/app.js" ],
                "css": [ "src/app.css" ]
            }
        },
        "users": {
            "classPath": "app[\"pages\"].Users",
            "assets": {
                "js": [ "src/Users.js" ],
                "css": [ "src/Users.css" ]
            }
        }
    }

Using the manifest API
----------------------

Initializing manifest

    var manifest = grocer.Manifest.create(manifestJson);

Fetching asset list for module

    manifest.getAssetsForModule('common', 'js').getAssetNames();

    /*
    [ "src/app.js" ]
    */

Fetching all assets from manifest

    manifest.getAssets('js').getAssetNames();

    /*
    [ "src/jquery.js", "src/app.js", "src/Users.js" ]
    */

Fetching script tag list from manifest

    manifest.getAssets('js').toString();

    /*
    <script src="src/jquery.js"></script>
    <script src="src/app.js"></script>
    <script src="src/Users.js"></script>
    */

    manifest.getAssets('css').toString();

    /*
    <link rel="stylesheet" href="src/app.css">
    <link rel="stylesheet" href="src/Users.css">
    */

Using the config API
--------------------

Creating and loading a *multi* task:

    'foo'
        // setting task config
        .toMultiTask({
            target1: {},
            target2: {}
        })

        // associating NPM package
        .setPackageName('grunt-foo')

        // loading package
        .applyTask();

Creating and registering an *alias* task:

    'foo'.toAliasTask()
        // adding subtasks
        .addSubTasks('copy:dev', 'uglify:dev')

        // registering task
        .applyTask();

Creating multi tasks w/ alias tasks for each target

    var multiTasks = [
        'foo'.toMultiTask({dev: {}, prod: {}})
            .setPackageName('grunt-foo'),
        'bar'.toMultiTask({dev: {}, prod: {}})
            .setPackageName('grunt-bar')
    ].toMultiTaskCollection();

    multiTasks.toGruntConfig()
        // applying (initializing/merging) config
        .applyConfig()

        // obtaining and adding alias tasks for each target
        .getAliasTasksGroupedByTarget()
        .mergeWith(multiTasks.toGruntTaskCollection())

        // applying (registering/loading) each task
        .applyTask();

As a result of the above, there will be a separate task for targets `dev` and `prod`, grouping all tasks that have those targets.

Eg. after setting up the Gruntfile like that, you may issue `grunt dev` or `grunt prod` to run all associated tasks.
