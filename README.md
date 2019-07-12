# M/MUMPS/Caché language syntax for [Visual Studio Code](https://code.visualstudio.com)

**This extension is not maintained. Please see [David Silin's extension](https://marketplace.visualstudio.com/items?itemName=dsilin.mumps) which has many more features.**

This is a simple [conversion](https://code.visualstudio.com/docs/customization/colorizer#_adding-a-new-language) of the [M/MUMPS/Caché language syntax for TextMate](https://github.com/ksherlock/MUMPS.tmbundle).

## Simple language hints

It also shows information about functions and built-in variables. Specifically, it:

* Shows hover hints for built-in commands, variables and functions. This can help newcomers who are unfamiliar with single-letter names.
* Shows hover hints for calls to labeled code blocks. If the label has comments after it, they are used to describe it and its parameters.
* Allows jumping to labels, in both the open file and in nearby files, using *Go to Definition*.

This language support is very basic (and possibly buggy) because it only does simple parsing and doesn't use a full interpreter.