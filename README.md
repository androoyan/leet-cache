<div align="center">
  <img src="https://github.com/axyan/leet-cache/blob/main/src/assets/icons/leet-cache-96x96.png" width="75" height="75"/>
  <h1>Leet Cache</h1>
  <a href="https://addons.mozilla.org/en-US/firefox/addon/leet-cache/">
    <img alt="Mozilla Add-on" src="https://img.shields.io/amo/v/leet-cache?logo=firefox&style=for-the-badge&label=Firefox%20add-on">
  </a>
</div>

<br/>

Leet Cache is an extension that uses spaced repetition to help
users gain a deeper understanding for problem solving on LeetCode.

Spaced repetition is used to increase long-term retention of information.
However, memorizing how to solve problems is only half of the solution.
Understanding why one solution is more optimal than another solution will help 
efficiently solve future problems. Thus this extension has a notes
feature where you can include your thoughts, optimal solutions, edge cases, and
more about a problem. When it comes time to review, you can check if your notes
match your current approach to the problem. If your approach is optimal
you can continue on reviewing other cards; else you can choose to implement the
solution to help solidify your understanding of the problem.

This extension was designed using a spaced repetition algorithm based on the
algorithm found in the open-source Anki software. Anki is a flashcards software
that uses spaced repetition to determine when flashcards are reviewed. The
algorithm can be found in Anki's source code.

## Installation

```bash
npm install
```

## Usage

To begin development:

```bash
npm run start
```

To use development extension, open a new Firefox browser and go to
'about:debugging'. Navigate to 'This Firefox' and select 'Load Temporary
Add-on'. Locate and open manifest.json found in the /dist directory.

## Build

Increment the version number found in package.json before building.

```bash
npm run build
```

## License

All code available under the [GPLv3 license](https://github.com/axyan/leet-cache/blob/main/LICENSE).
