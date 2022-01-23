# Markdown Link Completion Provider README

This is a very simple completion provider for links to headers in markdown files.

Only links in the own document are supported, like  [such links](#markdowncompletionprovider-readme).

The possible links are shown when '#' is pressed after ']('. or when Ctrl+Space is pressed after '](#'.

The headers are converted to links according to [this description](https://docs.gitlab.com/ee/user/markdown.html#header-ids-and-links).

Known issues:

* Should: If a header with the same ID has already been generated, a unique incrementing number is appended, starting at 1
  * But: Duplicate headers are not supported
* When you have already typed e.g. '[such links](#ma' and then you press Ctrl+Space, no completion items are shown. You have to delete 'ma' and press Ctrl+-Space again
* It seems that the rules or the tools are not consistent, if special characters and spaces are part of a header directly after each other. E.g. "# Import / Export" should create a link #import-export according to above rules, but this this link not work; neither in VS Code, nor in markdown preview enhanced
* There is no cache of headers. For every completion, the complete document is scanned for headers. Still, for a document with some 1.000 rows this is absolutely no issue
* There are no tests yet, but the extension is rather simple

Note: I was very surprised that I did not find a working extension with this functionality. If there is a better one than this, please give me a hint.

Installation: Via VSCode Marketplace