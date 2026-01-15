<div align="center">
  <img src="./logo.svg" width="100px" alt="GitHub Cards" />
  <h1 style="font-size: 28px; margin: 10px 0;">GitHub Cards</h1>
  <p>Get dynamically generated GitHub stats on your README!</p>
</div>


<details>
<summary>Table of contents (Click to show)</summary>

- [GitHub Stats Card](#github-stats-card)
    - [Hiding individual stats](#hiding-individual-stats)
    - [Showing additional individual stats](#showing-additional-individual-stats)
    - [Showing icons](#showing-icons)
    - [Showing commits count for specified year](#showing-commits-count-for-specified-year)
    - [Themes](#themes)
    - [Customization](#customization)
- [GitHub Extra Pins](#github-extra-pins)
    - [Usage](#usage)
    - [Options](#options)
    - [Demo](#demo)
- [GitHub Gist Pins](#github-gist-pins)
    - [Usage](#usage-1)
    - [Options](#options-1)
    - [Demo](#demo-1)
- [Top Languages Card](#top-languages-card)
    - [Usage](#usage-2)
    - [Options](#options-2)
    - [Language stats algorithm](#language-stats-algorithm)
    - [Exclude individual repositories](#exclude-individual-repositories)
    - [Hide individual languages](#hide-individual-languages)
    - [Show more languages](#show-more-languages)
    - [Compact Language Card Layout](#compact-language-card-layout)
    - [Donut Chart Language Card Layout](#donut-chart-language-card-layout)
    - [Donut Vertical Chart Language Card Layout](#donut-vertical-chart-language-card-layout)
    - [Pie Chart Language Card Layout](#pie-chart-language-card-layout)
    - [Hide Progress Bars](#hide-progress-bars)
    - [Change format of language's stats](#change-format-of-languages-stats)
    - [Demo](#demo-2)
- [All Demos](DEMO.md)
- [Tips (Align The Cards)](#tips-align-the-cards)
    - [Stats and top languages cards](#stats-and-top-languages-cards)
    - [Pinning repositories](#pinning-repositories)
- [Deploy on your own](#deploy-on-your-own)
    - [Get your Personal Access Token (PAT)](#get-your-personal-access-token-pat)
        - [Classic token](#classic-token)
        - [Fine-grained token](#fine-grained-token)
    - [Docker](#docker)
    - [Available environment variables](#available-environment-variables)
</details>

# Important Notices <!-- omit in toc -->

> [!IMPORTANT]
> This is a personal fork of [github-cards](https://github.com/anuraghazra/github-cards) and is **not intended for public use**. This instance is configured specifically for my personal needs and may have custom modifications, restricted access, or different rate limits.
>
> **If you want to use github-cards:**
> - Fork the [original repository](https://github.com/anuraghazra/github-cards) and deploy your own
>
> You are free to fork this repository and modify it however you like in accordance with the project's license.

# GitHub Stats Card

Copy and paste this into your markdown, and that's it. Simple!

Change the `?username=` value to your GitHub username.

```md
[![Anurag's GitHub stats](https://github-cards.nat.gg/api?username=NATroutter)](https://github.com/natroutter/github-cards)
```

> [!WARNING]
> By default, the stats card only shows statistics like stars, commits, and pull requests from public repositories. To show private statistics on the stats card, you should [deploy your own instance](#deploy-on-your-own) using your own GitHub API token.

> [!NOTE]
> Available ranks are S (top 1%), A+ (12.5%), A (25%), A- (37.5%), B+ (50%), B (62.5%), B- (75%), C+ (87.5%) and C (everyone). This ranking scheme is based on the [Japanese academic grading](https://wikipedia.org/wiki/Academic_grading_in_Japan) system. The global percentile is calculated as a weighted sum of percentiles for each statistic (number of commits, pull requests, reviews, issues, stars, and followers), based on the cumulative distribution function of the [exponential](https://wikipedia.org/wiki/exponential_distribution) and the [log-normal](https://wikipedia.org/wiki/Log-normal_distribution) distributions. The implementation can be investigated at [src/calculateRank.js](https://github.com/natroutter/github-cards/blob/master/src/calculateRank.js). The circle around the rank shows 100 minus the global percentile.

### Hiding individual stats

You can pass a query parameter `&hide=` to hide any specific stats with comma-separated values.

> Options: `&hide=stars,commits,prs,issues,contribs`

```md
![Anurag's GitHub stats](https://github-cards.nat.gg/api?username=NATroutter&hide=contribs,prs)
```

### Showing additional individual stats

You can pass a query parameter `&show=` to show any specific additional stats with comma-separated values.

> Options: `&show=reviews,discussions_started,discussions_answered,prs_merged,prs_merged_percentage`

```md
![Anurag's GitHub stats](https://github-cards.nat.gg/api?username=NATroutter&show=reviews,discussions_started,discussions_answered,prs_merged,prs_merged_percentage)
```

### Showing icons

To enable icons, you can pass `&show_icons=true` in the query param, like so:

```md
![Anurag's GitHub stats](https://github-cards.nat.gg/api?username=NATroutter&show_icons=true)
```

### Showing commits count for specified year

You can specify a year and fetch only the commits that were made in that year by passing `&commits_year=YYYY` to the parameter.

```md
![Anurag's GitHub stats](https://github-cards.nat.gg/api?username=NATroutter&commits_year=2020)
```

### Themes

With inbuilt themes, you can customize the look of the card without doing any [manual customization](#customization).

Use `&theme=THEME_NAME` parameter like so :

```md
![Anurag's GitHub stats](https://github-cards.nat.gg/api?username=NATroutter&show_icons=true&theme=radical)
```

#### All inbuilt themes

GitHub Readme Stats comes with several built-in themes (e.g. `dark`, `radical`, `merko`, `gruvbox`, `tokyonight`, `onedark`, `cobalt`, `synthwave`, `highcontrast`, `dracula`).


You can look at a preview for [all available themes](themes/README.md) or checkout the [theme config file](themes/index.js). Please note that we paused the addition of new themes to decrease maintenance efforts; all pull requests related to new themes will be closed.

#### Responsive Card Theme

[![Anurag's GitHub stats-Dark](https://github-cards.nat.gg/api?username=NATroutter&show_icons=true&theme=dark#gh-dark-mode-only)](https://github.com/natroutter/github-cards#responsive-card-theme#gh-dark-mode-only)
[![Anurag's GitHub stats-Light](https://github-cards.nat.gg/api?username=NATroutter&show_icons=true&theme=default#gh-light-mode-only)](https://github.com/natroutter/github-cards#responsive-card-theme#gh-light-mode-only)

Since GitHub will re-upload the cards and serve them from their [CDN](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-anonymized-urls), we can not infer the browser/GitHub theme on the server side. There are, however, four methods you can use to create dynamics themes on the client side.

##### Use the transparent theme

We have included a `transparent` theme that has a transparent background. This theme is optimized to look good on GitHub's dark and light default themes. You can enable this theme using the `&theme=transparent` parameter like so:

```md
![Anurag's GitHub stats](https://github-cards.nat.gg/api?username=NATroutter&show_icons=true&theme=transparent)
```

<details>
<summary>:eyes: Show example</summary>

![Anurag's GitHub stats](https://github-cards.nat.gg/api?username=NATroutter\&show_icons=true\&theme=transparent)

</details>

##### Add transparent alpha channel to a themes bg\_color

You can use the `bg_color` parameter to make any of [the available themes](themes/README.md) transparent. This is done by setting the `bg_color` to a color with a transparent alpha channel (i.e. `bg_color=00000000`):

```md
![Anurag's GitHub stats](https://github-cards.nat.gg/api?username=NATroutter&show_icons=true&bg_color=00000000)
```

<details>
<summary>:eyes: Show example</summary>

![Anurag's GitHub stats](https://github-cards.nat.gg/api?username=NATroutter\&show_icons=true\&bg_color=00000000)

</details>

##### Use GitHub's theme context tag

You can use [GitHub's theme context](https://github.blog/changelog/2021-11-24-specify-theme-context-for-images-in-markdown/) tags to switch the theme based on the user GitHub theme automatically. This is done by appending `#gh-dark-mode-only` or `#gh-light-mode-only` to the end of an image URL. This tag will define whether the image specified in the markdown is only shown to viewers using a light or a dark GitHub theme:

```md
[![Anurag's GitHub stats-Dark](https://github-cards.nat.gg/api?username=NATroutter&show_icons=true&theme=dark#gh-dark-mode-only)](https://github.com/natroutter/github-cards#gh-dark-mode-only)
[![Anurag's GitHub stats-Light](https://github-cards.nat.gg/api?username=NATroutter&show_icons=true&theme=default#gh-light-mode-only)](https://github.com/natroutter/github-cards#gh-light-mode-only)
```

<details>
<summary>:eyes: Show example</summary>

[![Anurag's GitHub stats-Dark](https://github-cards.nat.gg/api?username=NATroutter\&show_icons=true\&theme=dark#gh-dark-mode-only)](https://github.com/natroutter/github-cards#gh-dark-mode-only)
[![Anurag's GitHub stats-Light](https://github-cards.nat.gg/api?username=NATroutter\&show_icons=true\&theme=default#gh-light-mode-only)](https://github.com/natroutter/github-cards#gh-light-mode-only)

</details>

##### Use GitHub's new media feature

You can use [GitHub's new media feature](https://github.blog/changelog/2022-05-19-specify-theme-context-for-images-in-markdown-beta/) in HTML to specify whether to display images for light or dark themes. This is done using the HTML `<picture>` element in combination with the `prefers-color-scheme` media feature.

```html
<picture>
  <source
    srcset="https://github-cards.nat.gg/api?username=NATroutter&show_icons=true&theme=dark"
    media="(prefers-color-scheme: dark)"
  />
  <source
    srcset="https://github-cards.nat.gg/api?username=NATroutter&show_icons=true"
    media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)"
  />
  <img src="https://github-cards.nat.gg/api?username=NATroutter&show_icons=true" />
</picture>
```

<details>
<summary>:eyes: Show example</summary>

<picture>
  <source
    srcset="https://github-cards.nat.gg/api?username=NATroutter&show_icons=true&theme=dark"
    media="(prefers-color-scheme: dark)"
  />
  <source
    srcset="https://github-cards.nat.gg/api?username=NATroutter&show_icons=true"
    media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)"
  />
  <img src="https://github-cards.nat.gg/api?username=NATroutter&show_icons=true" />
</picture>

</details>

### Customization

You can customize the appearance of all your cards however you wish with URL parameters.

#### Common Options

| Name | Description | Type | Default value |
| --- | --- | --- | --- |
| `title_color` | Card's title color. | string (hex color) | `2f80ed` |
| `text_color` | Body text color. | string (hex color) | `434d58` |
| `icon_color` | Icons color if available. | string (hex color) | `4c71f2` |
| `border_color` | Card's border color. Does not apply when `hide_border` is enabled. | string (hex color) | `e4e2e2` |
| `bg_color` | Card's background color. | string (hex color or a gradient in the form of *angle,start,end*) | `fffefe` |
| `hide_border` | Hides the card's border. | boolean | `false` |
| `theme` | Name of the theme, choose from [all available themes](themes/README.md). | enum | `default` |
| `cache_seconds` | Sets the cache header manually (min: 21600, max: 86400). | integer | `21600` |
| `locale` | Sets the language in the card, you can check full list of available locales [here](#available-locales). | enum | `en` |
| `border_radius` | Corner rounding on the card. | number | `4.5` |

> [!WARNING]
> We use caching to decrease the load on our servers (see <https://github.com/natroutter/github-cards/issues/1471#issuecomment-1271551425>). Our cards have the following default cache hours: stats card - 24 hours, top languages card - 144 hours (6 days), pin card - 240 hours (10 days), gist card - 48 hours (2 days), and wakatime card - 24 hours. If you want the data on your cards to be updated more often you can [deploy your own instance](#deploy-on-your-own) and set [environment variable](#available-environment-variables) `CACHE_SECONDS` to a value of your choosing.

##### Gradient in bg\_color

You can provide multiple comma-separated values in the bg\_color option to render a gradient with the following format:

    &bg_color=DEG,COLOR1,COLOR2,COLOR3...COLOR10

##### Available locales

Here is a list of all available locales:

<table>
<tr><td>

| Code | Locale |
| --- | --- |
| `ar` | Arabic |
| `az` | Azerbaijani |
| `bn` | Bengali |
| `bg` | Bulgarian |
| `my` | Burmese |
| `ca` | Catalan |
| `cn` | Chinese |
| `zh-tw` | Chinese (Taiwan) |
| `cs` | Czech |
| `nl` | Dutch |
| `en` | English |
| `fil` | Filipino |
| `fi` | Finnish |
| `fr` | French |
| `de` | German |
| `el` | Greek |

</td><td>

| Code | Locale |
| --- | --- |
| `he` | Hebrew |
| `hi` | Hindi |
| `hu` | Hungarian |
| `id` | Indonesian |
| `it` | Italian |
| `ja` | Japanese |
| `kr` | Korean |
| `ml` | Malayalam |
| `np` | Nepali |
| `no` | Norwegian |
| `fa` | Persian (Farsi) |
| `pl` | Polish |
| `pt-br` | Portuguese (Brazil) |
| `pt-pt` | Portuguese (Portugal) |
| `ro` | Romanian |

</td><td>

| Code | Locale |
| --- | --- |
| `ru` | Russian |
| `sa` | Sanskrit |
| `sr` | Serbian (Cyrillic) |
| `sr-latn` | Serbian (Latin) |
| `sk` | Slovak |
| `es` | Spanish |
| `sw` | Swahili |
| `se` | Swedish |
| `ta` | Tamil |
| `th` | Thai |
| `tr` | Turkish |
| `uk-ua` | Ukrainian |
| `ur` | Urdu |
| `uz` | Uzbek |
| `vi` | Vietnamese |

</td></tr>
</table>

If we don't support your language, please consider contributing! You can find more information about how to do it in our [contributing guidelines](CONTRIBUTING.md#translations-contribution).

#### Stats Card Exclusive Options

| Name | Description | Type | Default value |
| --- | --- | --- | --- |
| `hide` | Hides the [specified items](#hiding-individual-stats) from stats. | string (comma-separated values) | `null` |
| `hide_title` | Hides the title of your stats card. | boolean | `false` |
| `card_width` | Sets the card's width manually. | number | `500px  (approx.)` |
| `hide_rank` | Hides the rank and automatically resizes the card width. | boolean | `false` |
| `rank_icon` | Shows alternative rank icon (i.e. `github`, `percentile` or `default`). | enum | `default` |
| `show_icons` | Shows icons near all stats. | boolean | `false` |
| `include_all_commits` | Count total commits instead of just the current year commits. | boolean | `false` |
| `line_height` | Sets the line height between text. | integer | `25` |
| `exclude_repo` | Excludes specified repositories. | string (comma-separated values) | `null` |
| `custom_title` | Sets a custom title for the card. | string | `<username> GitHub Stats` |
| `text_bold` | Uses bold text. | boolean | `true` |
| `disable_animations` | Disables all animations in the card. | boolean | `false` |
| `ring_color` | Color of the rank circle. | string (hex color) | `2f80ed` |
| `number_format` | Switches between two available formats for displaying the card values `short` (i.e. `6.6k`) and `long` (i.e. `6626`). | enum | `short` |
| `number_precision` | Enforce the number of digits after the decimal point for `short` number format. Must be an integer between 0 and 2. Will be ignored for `long` number format. | integer (0, 1 or 2) | `null` |
| `show` | Shows [additional items](#showing-additional-individual-stats) on stats card (i.e. `reviews`, `discussions_started`, `discussions_answered`, `prs_merged` or `prs_merged_percentage`). | string (comma-separated values) | `null` |
| `commits_year` | Filters and counts only commits made in the specified year. | integer _(YYYY)_ | `<current year> (one year to date)` |

> [!WARNING]
> Custom title should be URI-escaped, as specified in [Percent Encoding](https://en.wikipedia.org/wiki/Percent-encoding) (i.e: `Anurag's GitHub Stats` should become `Anurag%27s%20GitHub%20Stats`). You can use [urlencoder.org](https://www.urlencoder.org/) to help you do this automatically.

> [!NOTE]
> When hide\_rank=`true`, the minimum card width is 270 px + the title length and padding.

***

# GitHub Extra Pins

GitHub extra pins allow you to pin more than 6 repositories in your profile using a GitHub readme profile.

Yay! You are no longer limited to 6 pinned repositories.

### Usage

Copy-paste this code into your readme and change the links.

Endpoint: `api/pin?username=NATroutter&repo=github-cards`

```md
[![Readme Card](https://github-cards.nat.gg/api/pin/?username=NATroutter&repo=github-cards)](https://github.com/natroutter/github-cards)
```

### Options

You can customize the appearance and behavior of the pinned repository card using the [common options](#common-options) and exclusive options listed in the table below.

| Name | Description | Type | Default value |
| --- | --- | --- | --- |
| `show_owner` | Shows the repo's owner name. | boolean | `false` |
| `description_lines_count` | Manually set the number of lines for the description. Specified value will be clamped between 1 and 3. If this parameter is not specified, the number of lines will be automatically adjusted according to the actual length of the description. | number | `null` |

### Demo

![Readme Card](https://github-cards.nat.gg/api/pin/?username=NATroutter&repo=github-cards)

Use `show_owner` query option to include the repo's owner username

![Readme Card](https://github-cards.nat.gg/api/pin/?username=NATroutter&repo=github-cards&show_owner=true)

# GitHub Gist Pins

GitHub gist pins allow you to pin gists in your GitHub profile using a GitHub readme profile.

### Usage

Copy-paste this code into your readme and change the links.

Endpoint: `api/gist?id=bbfce31e0217a3689c8d961a356cb10d`

```md
[![Gist Card](https://github-cards.nat.gg/api/gist?id=bbfce31e0217a3689c8d961a356cb10d)](https://gist.github.com/Yizack/bbfce31e0217a3689c8d961a356cb10d/)
```

### Options

You can customize the appearance and behavior of the gist card using the [common options](#common-options) and exclusive options listed in the table below.

| Name | Description | Type | Default value |
| --- | --- | --- | --- |
| `show_owner` | Shows the gist's owner name. | boolean | `false` |

### Demo

![Gist Card](https://github-cards.nat.gg/api/gist?id=bbfce31e0217a3689c8d961a356cb10d)

Use `show_owner` query option to include the gist's owner username

![Gist Card](https://github-cards.nat.gg/api/gist?id=bbfce31e0217a3689c8d961a356cb10d&show_owner=true)

# Top Languages Card

The top languages card shows a GitHub user's most frequently used languages.

> [!WARNING]
> By default, the language card shows language results only from public repositories. To include languages used in private repositories, you should [deploy your own instance](#deploy-on-your-own) using your own GitHub API token.

> [!NOTE]
> Top Languages does not indicate the user's skill level or anything like that; it's a GitHub metric to determine which languages have the most code on GitHub. It is a new feature of github-cards.

> [!WARNING]
> This card shows language usage only inside your own non-forked repositories, not depending on who the author of the commits is. It does not include your contributions into another users/organizations repositories. Currently there are no way to get this data from GitHub API. If you want this behavior to be improved you can support [this feature request](https://github.com/orgs/community/discussions/18230) created by [@rickstaa](https://github.com/rickstaa) inside GitHub Community.

> [!WARNING]
> Currently this card shows data only about first 100 repositories. This is because GitHub API limitations which cause downtimes of public instances (see [#1471](https://github.com/natroutter/github-cards/issues/1471)). In future this behavior will be improved by releasing GitHub action or providing environment variables for user's own instances.

### Usage

Copy-paste this code into your readme and change the links.

Endpoint: `api/top-langs?username=NATroutter`

```md
[![Top Langs](https://github-cards.nat.gg/api/top-langs/?username=NATroutter)](https://github.com/natroutter/github-cards)
```

### Options

You can customize the appearance and behavior of the top languages card using the [common options](#common-options) and exclusive options listed in the table below.

| Name | Description | Type | Default value |
| --- | --- | --- | --- |
| `hide` | Hides the [specified languages](#hide-individual-languages) from card. | string (comma-separated values) | `null` |
| `hide_title` | Hides the title of your card. | boolean | `false` |
| `layout` | Switches between five available layouts `normal` & `compact` & `donut` & `donut-vertical` & `pie`. | enum | `normal` |
| `card_width` | Sets the card's width manually. | number | `300` |
| `langs_count` | Shows more languages on the card, between 1-20. | integer | `5` for `normal` and `donut`, `6` for other layouts |
| `exclude_repo` | Excludes specified repositories. | string (comma-separated values) | `null` |
| `custom_title` | Sets a custom title for the card. | string | `Most Used Languages` |
| `disable_animations` | Disables all animations in the card. | boolean | `false` |
| `hide_progress` | Uses the compact layout option, hides percentages, and removes the bars. | boolean | `false` |
| `size_weight` | Configures language stats algorithm (see [Language stats algorithm](#language-stats-algorithm)). | integer | `1` |
| `count_weight` | Configures language stats algorithm (see [Language stats algorithm](#language-stats-algorithm)). | integer | `0` |
| `stats_format` | Switches between two available formats for language's stats `percentages` and `bytes`. | enum | `percentages` |

> [!WARNING]
> Language names and custom title should be URI-escaped, as specified in [Percent Encoding](https://en.wikipedia.org/wiki/Percent-encoding) (i.e: `c++` should become `c%2B%2B`, `jupyter notebook` should become `jupyter%20notebook`, `Most Used Languages` should become `Most%20Used%20Languages`, etc.) You can use [urlencoder.org](https://www.urlencoder.org/) to help you do this automatically.

### Language stats algorithm

We use the following algorithm to calculate the languages percentages on the language card:

```js
ranking_index = (byte_count ^ size_weight) * (repo_count ^ count_weight)
```

By default, only the byte count is used for determining the languages percentages shown on the language card (i.e. `size_weight=1` and `count_weight=0`). You can, however, use the `&size_weight=` and `&count_weight=` options to weight the language usage calculation. The values must be positive real numbers. [More details about the algorithm can be found here](https://github.com/natroutter/github-cards/issues/1600#issuecomment-1046056305).

*   `&size_weight=1&count_weight=0` - *(default)* Orders by byte count.
*   `&size_weight=0.5&count_weight=0.5` - *(recommended)* Uses both byte and repo count for ranking
*   `&size_weight=0&count_weight=1` - Orders by repo count

```md
![Top Langs](https://github-cards.nat.gg/api/top-langs/?username=NATroutter&size_weight=0.5&count_weight=0.5)
```

### Exclude individual repositories

You can use the `&exclude_repo=repo1,repo2` parameter to exclude individual repositories.

```md
![Top Langs](https://github-cards.nat.gg/api/top-langs/?username=NATroutter&exclude_repo=github-cards,NATroutter.github.io)
```

### Hide individual languages

You can use `&hide=language1,language2` parameter to hide individual languages.

```md
![Top Langs](https://github-cards.nat.gg/api/top-langs/?username=NATroutter&hide=javascript,html)
```

### Show more languages

You can use the `&langs_count=` option to increase or decrease the number of languages shown on the card. Valid values are integers between 1 and 20 (inclusive). By default it was set to `5` for `normal` & `donut` and `6` for other layouts.

```md
![Top Langs](https://github-cards.nat.gg/api/top-langs/?username=NATroutter&langs_count=8)
```

### Compact Language Card Layout

You can use the `&layout=compact` option to change the card design.

```md
![Top Langs](https://github-cards.nat.gg/api/top-langs/?username=NATroutter&layout=compact)
```

### Donut Chart Language Card Layout

You can use the `&layout=donut` option to change the card design.

```md
[![Top Langs](https://github-cards.nat.gg/api/top-langs/?username=NATroutter&layout=donut)](https://github.com/natroutter/github-cards)
```

### Donut Vertical Chart Language Card Layout

You can use the `&layout=donut-vertical` option to change the card design.

```md
[![Top Langs](https://github-cards.nat.gg/api/top-langs/?username=NATroutter&layout=donut-vertical)](https://github.com/natroutter/github-cards)
```

### Pie Chart Language Card Layout

You can use the `&layout=pie` option to change the card design.

```md
[![Top Langs](https://github-cards.nat.gg/api/top-langs/?username=NATroutter&layout=pie)](https://github.com/natroutter/github-cards)
```

### Hide Progress Bars

You can use the `&hide_progress=true` option to hide the percentages and the progress bars (layout will be automatically set to `compact`).

```md
![Top Langs](https://github-cards.nat.gg/api/top-langs/?username=NATroutter&hide_progress=true)
```

### Change format of language's stats

You can use the `&stats_format=bytes` option to display the stats in bytes instead of percentage.

```md
![Top Langs](https://github-cards.nat.gg/api/top-langs/?username=NATroutter&stats_format=bytes)
```


### Demo

![Top Langs](https://github-cards.nat.gg/api/top-langs/?username=NATroutter)
![Top Langs](https://github-cards.nat.gg/api/top-langs/?username=NATroutter&layout=compact)

***

## Tips (Align The Cards)

By default, GitHub does not lay out the cards side by side. To do that, you can use such approaches:

### Stats and top languages cards

```html
<a href="https://github.com/natroutter/github-cards">
  <img height=200 align="center" src="https://github-cards.nat.gg/api?username=NATroutter" />
</a>
<a href="https://github.com/natroutter/convoychat">
  <img height=200 align="center" src="https://github-cards.nat.gg/api/top-langs?username=NATroutter&layout=compact&langs_count=8&card_width=320" />
</a>
```

<details>
<summary>:eyes: Show example</summary>

<a href="https://github.com/natroutter/github-cards">
  <img height=200 align="center" src="https://github-cards.nat.gg/api?username=NATroutter" />
</a>
<a href="https://github.com/natroutter/convoychat">
  <img height=200 align="center" src="https://github-cards.nat.gg/api/top-langs?username=NATroutter&layout=compact&langs_count=8&card_width=320" />
</a>

</details>

### Pinning repositories

```html
<a href="https://github.com/natroutter/egg-hytale">
  <img align="center" src="https://github-cards.nat.gg/api/pin/?username=NATroutter&repo=egg-hytale" />
</a>
<a href="https://github.com/natroutter/github-cards">
  <img align="center" src="https://github-cards.nat.gg/api/pin/?username=NATroutter&repo=github-cards" />
</a>
```

<details>
<summary>:eyes: Show example</summary>

<a href="https://github.com/natroutter/egg-hytale">
  <img align="center" src="https://github-cards.nat.gg/api/pin/?username=NATroutter&repo=egg-hytale" />
</a>
<a href="https://github.com/natroutter/github-cards">
  <img align="center" src="https://github-cards.nat.gg/api/pin/?username=NATroutter&repo=github-cards" />
</a>

</details>

# Deploy on your own

## Get your Personal Access Token (PAT)

For deploying your own instance of GitHub Readme Stats, you will need to create a GitHub Personal Access Token (PAT). Below are the steps to create one and the scopes you need to select for both classic and fine-grained tokens.

Selecting the right scopes for your token is important in case you want to display private contributions on your cards.

### Classic token

* Go to [Account -> Settings -> Developer Settings -> Personal access tokens -> Tokens (classic)](https://github.com/settings/tokens).
* Click on `Generate new token -> Generate new token (classic)`.
* Scopes to select:
    * repo
    * read:user
* Click on `Generate token` and copy it.

### Fine-grained token

> [!WARNING]\
> This limits the scope to issues in your repositories and includes only public commits.

* Go to [Account -> Settings -> Developer Settings -> Personal access tokens -> Fine-grained tokens](https://github.com/settings/tokens).
* Click on `Generate new token -> Generate new token`.
* Select an expiration date
* Select `All repositories`
* Scopes to select in `Repository permission`:
    * Commit statuses: read-only
    * Contents: read-only
    * Issues: read-only
    * Metadata: read-only
    * Pull requests: read-only
* Click on `Generate token` and copy it.

## Docker

<summary><b>:hammer_and_wrench: Step-by-step guide for deploying using docker</b></summary>

1. Install docker by following their documentation at [docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)
2. Copy the [compose.yml](compose.yml) file to your host/machine
3. Customize the compose file to your liking you need to at least change the PAT_1 variable for your GitHub access token see [Get your Personal Access Token (PAT)](#Get-your-personal-access-token-pat)
3. run command ``docker compose up -d`` on the folder where you placed the compose file
6. You're done 🎉

## Available environment variables

GitHub Cards provides several environment variables that can be used to customize the behavior of your self-hosted instance. These include:

| Name                       | Description                                                                                                                                                                                                                                                                                              | Supported values                               |
|----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------|
| `CACHE_SECONDS`            | Sets the cache duration in seconds for the generated cards. This variable takes precedence over the default cache timings for the public instance. If this variable is not set, the default cache duration is 24 hours (86,400 seconds).                                                                 | Any positive integer or `0` to disable caching |
| `WHITELIST`                | A comma-separated list of GitHub usernames that are allowed to access your instance. If this variable is not set, all usernames are allowed.                                                                                                                                                             | Comma-separated GitHub usernames               |
| `GIST_WHITELIST`           | A comma-separated list of GitHub Gist IDs that are allowed to be accessed on your instance. If this variable is not set, all Gist IDs are allowed.                                                                                                                                                       | Comma-separated GitHub Gist IDs                |
| `EXCLUDE_REPO`             | A comma-separated list of repositories that will be excluded from stats and top languages cards on your instance. This allows repository exclusion without exposing repository names in public URLs. This enhances privacy for self-hosted instances that include private repositories in stats cards.   | Comma-separated repository names               |
| `FETCH_MULTI_PAGE_STARS`   | Enables fetching all starred repositories for accurate star counts, especially for users with more than 100 repositories. This may increase response times and API points usage, so it is disabled on the public instance.                                                                               | `true` or `false`                              |