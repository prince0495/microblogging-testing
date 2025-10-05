import { useUserStore } from '@/lib/store';
import React, { use, useCallback, useEffect, useRef, useState } from 'react';

// --- DUMMY DATA (Hardcoded as requested) ---
const DUMMY_POST_DATA = [
  {
    "id": "115280709687983390",
    "created_at": "2025-09-28T07:20:31.000Z",
    "in_reply_to_id": null,
    "in_reply_to_account_id": null,
    "sensitive": false,
    "spoiler_text": "",
    "visibility": "public",
    "language": "en",
    "uri": "https://observatory.social/users/BGO/statuses/115280709626146599",
    "url": "https://observatory.social/@BGO/115280709626146599",
    "replies_count": 0,
    "reblogs_count": 0,
    "favourites_count": 10,
    "quotes_count": 0,
    "edited_at": null,
    "content": "\u003Cp\u003EAt 04:20:30 \u003Ca href=\"https://observatory.social/tags/bgosays\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003Ebgosays\u003C/span\u003E\u003C/a\u003E I just took an image of COCOONNEBULA (ID 30125) in the RED2 filter for Lucien Rucci!\u003C/p\u003E",
    "reblog": null,
    "account": {
      "id": "110276943159277359",
      "username": "BGO",
      "acct": "BGO@observatory.social",
      "display_name": "Burke-Gaffney Observatory",
      "locked": false,
      "bot": true,
      "discoverable": true,
      "indexable": false,
      "group": false,
      "created_at": "2023-04-20T00:00:00.000Z",
      "note": "\u003Cp\u003EThe robotic Burke-Gaffney Observatory with its Ralph Medjuck Telescope at Saint Mary's University. It's usually the telescope posting!\u003C/p\u003E\u003Cp\u003ERobot minded by the \u003Ca href=\"https://observatory.social/tags/human\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003Ehuman\u003C/span\u003E\u003C/a\u003E \u003Cspan class=\"h-card\" translate=\"no\"\u003E\u003Ca href=\"https://observatory.social/@human\" class=\"u-url mention\" rel=\"nofollow noopener\" target=\"_blank\"\u003E@\u003Cspan\u003Ehuman\u003C/span\u003E\u003C/a\u003E\u003C/span\u003E.\u003C/p\u003E",
      "url": "https://observatory.social/@BGO",
      "uri": "https://observatory.social/users/BGO",
      "avatar": "https://files.mastodon.social/cache/accounts/avatars/110/276/943/159/277/359/original/c9bb7cf590a2af31.png",
      "avatar_static": "https://files.mastodon.social/cache/accounts/avatars/110/276/943/159/277/359/original/c9bb7cf590a2af31.png",
      "header": "https://files.mastodon.social/cache/accounts/headers/110/276/943/159/277/359/original/cdc3a6cecaee9f22.jpg",
      "header_static": "https://files.mastodon.social/cache/accounts/headers/110/276/943/159/277/359/original/cdc3a6cecaee9f22.jpg",
      "followers_count": 227,
      "following_count": 2,
      "statuses_count": 10694,
      "last_status_at": "2025-09-28",
      "hide_collections": false,
      "emojis": [],
      "fields": [
        {
          "name": "How to Use Me",
          "value": "\u003Ca href=\"https://observatory.smu.ca/bgo-useme\" target=\"_blank\" rel=\"nofollow noopener\" translate=\"no\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://\u003C/span\u003E\u003Cspan class=\"\"\u003Eobservatory.smu.ca/bgo-useme\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E\u003C/span\u003E\u003C/a\u003E",
          "verified_at": "2025-09-28T07:08:15.745+00:00"
        }
      ]
    },
    "media_attachments": [],
    "mentions": [],
    "tags": [
      {
        "name": "bgosays",
        "url": "https://mastodon.social/tags/bgosays"
      }
    ],
    "emojis": [],
    "quote": null,
    "card": null,
    "poll": null,
    "quote_approval": {
      "automatic": [],
      "manual": [],
      "current_user": "denied"
    }
  },
  {
    "id": "115280709638902608",
    "created_at": "2025-09-28T07:20:26.000Z",
    "in_reply_to_id": null,
    "in_reply_to_account_id": null,
    "sensitive": false,
    "spoiler_text": "",
    "visibility": "public",
    "language": "en",
    "uri": "https://flipboard.com/users/NeilGreenfield/statuses/U9SBGC_PTWCSetJU2CtinQ:a:237818548",
    "url": "https://flipboard.com/@neilgreenfield/the-south-african-finance-economic-magazine-4atdnr02z/-/a-U9SBGC_PTWCSetJU2CtinQ%3Aa%3A237818548-%2F0",
    "replies_count": 0,
    "reblogs_count": 0,
    "favourites_count": 0,
    "quotes_count": 0,
    "edited_at": null,
    "content": "\u003Cp\u003EThe dark side of Eskom’s miraculous turnaround\u003Cbr\u003E\u003Ca href=\"https://businesstech.co.za/news/energy/838387/the-dark-side-of-eskoms-miraculous-turnaround/?utm_source=flipboard&amp;utm_medium=activitypub\" rel=\"nofollow noopener\" translate=\"no\" target=\"_blank\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://\u003C/span\u003E\u003Cspan class=\"ellipsis\"\u003Ebusinesstech.co.za/news/energy\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E/838387/the-dark-side-of-eskoms-miraculous-turnaround/?utm_source=flipboard&amp;utm_medium=activitypub \u003C/span\u003E\u003C/a\u003E\u003C/p\u003E\u003Cp\u003EPosted into The South African Finance &amp; Economic Magazine \u003Cspan class=\"h-card\" translate=\"no\"\u003E\u003Ca href=\"https://flipboard.com/@neilgreenfield/the-south-african-finance-economic-magazine-4atdnr02z\" class=\"u-url mention\" rel=\"nofollow noopener\" target=\"_blank\"\u003E@\u003Cspan\u003Ethe-south-african-finance-economic-magazine-NeilGreenfield\u003C/span\u003E\u003C/a\u003E\u003C/span\u003E\u003C/p\u003E",
    "reblog": null,
    "account": {
      "id": "112452248733460851",
      "username": "NeilGreenfield",
      "acct": "NeilGreenfield@flipboard.com",
      "display_name": "Neil Greenfield",
      "locked": false,
      "bot": false,
      "discoverable": true,
      "indexable": true,
      "group": false,
      "created_at": "2024-04-11T00:00:00.000Z",
      "note": "\u003Cp\u003ERetired South African living a flaneur, dilettante, vagabond,coddiwomple and peripatetic lifestyle...exploring the world - for loose and fancy free\u003C/p\u003E",
      "url": "https://flipboard.com/@NeilGreenfield",
      "uri": "https://flipboard.com/users/NeilGreenfield",
      "avatar": "https://files.mastodon.social/cache/accounts/avatars/112/452/248/733/460/851/original/06baa98c17fe0ea6.jpg",
      "avatar_static": "https://files.mastodon.social/cache/accounts/avatars/112/452/248/733/460/851/original/06baa98c17fe0ea6.jpg",
      "header": "https://mastodon.social/headers/original/missing.png",
      "header_static": "https://mastodon.social/headers/original/missing.png",
      "followers_count": 12292,
      "following_count": 154,
      "statuses_count": 45162,
      "last_status_at": "2025-09-28",
      "hide_collections": false,
      "emojis": [],
      "fields": []
    },
    "media_attachments": [],
    "mentions": [
      {
        "id": "114057371780478662",
        "username": "the-south-african-finance-economic-magazine-NeilGreenfield",
        "url": "https://flipboard.com/@neilgreenfield/the-south-african-finance-economic-magazine-4atdnr02z",
        "acct": "the-south-african-finance-economic-magazine-NeilGreenfield@flipboard.com"
      }
    ],
    "tags": [],
    "emojis": [],
    "quote": null,
    "card": null,
    "poll": null,
    "quote_approval": {
      "automatic": [],
      "manual": [],
      "current_user": "denied"
    }
  },
  {
    "id": "115280709634535803",
    "created_at": "2025-09-28T07:20:30.000Z",
    "in_reply_to_id": "115275630939714801",
    "in_reply_to_account_id": "109270297183300177",
    "sensitive": false,
    "spoiler_text": "",
    "visibility": "public",
    "language": "en",
    "uri": "https://mendeddrum.org/users/patrick/statuses/115280709566181242",
    "url": "https://mendeddrum.org/@patrick/115280709566181242",
    "replies_count": 0,
    "reblogs_count": 0,
    "favourites_count": 0,
    "quotes_count": 0,
    "edited_at": null,
    "content": "\u003Cp\u003EHaving fun again \u003Ca href=\"https://mendeddrum.org/tags/interrail\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003Einterrail\u003C/span\u003E\u003C/a\u003E \u003Ca href=\"https://mendeddrum.org/tags/swissalps\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003Eswissalps\u003C/span\u003E\u003C/a\u003E \u003Ca href=\"https://mendeddrum.org/tags/guessthestation\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003Eguessthestation\u003C/span\u003E\u003C/a\u003E\u003C/p\u003E",
    "reblog": null,
    "account": {
      "id": "109270297183300177",
      "username": "patrick",
      "acct": "patrick@mendeddrum.org",
      "display_name": "Patrick Dersjant RCX",
      "locked": false,
      "bot": false,
      "discoverable": false,
      "indexable": false,
      "group": false,
      "created_at": "2022-11-01T00:00:00.000Z",
      "note": "\u003Cp\u003EAdmin of the Mended Drum instance.\u003Cbr\u003E\u003Ca href=\"https://mendeddrum.org/tags/gnuterrypratchett\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003Egnuterrypratchett\u003C/span\u003E\u003C/a\u003E, climate, security, privacy, information management, open e-government, traintravellover &amp; family man.\u003C/p\u003E",
      "url": "https://mendeddrum.org/@patrick",
      "uri": "https://mendeddrum.org/users/patrick",
      "avatar": "https://files.mastodon.social/cache/accounts/avatars/109/270/297/183/300/177/original/9b6632983a0a4094.jpg",
      "avatar_static": "https://files.mastodon.social/cache/accounts/avatars/109/270/297/183/300/177/original/9b6632983a0a4094.jpg",
      "header": "https://files.mastodon.social/cache/accounts/headers/109/270/297/183/300/177/original/56eaa50f248ba312.jpg",
      "header_static": "https://files.mastodon.social/cache/accounts/headers/109/270/297/183/300/177/original/56eaa50f248ba312.jpg",
      "followers_count": 416,
      "following_count": 542,
      "statuses_count": 2153,
      "last_status_at": "2025-09-28",
      "hide_collections": false,
      "emojis": [],
      "fields": [
        {
          "name": "Location",
          "value": "BWV565",
          "verified_at": null
        },
        {
          "name": "Website",
          "value": "\u003Ca href=\"https://p45.nl\" rel=\"nofollow noopener\" translate=\"no\" target=\"_blank\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://\u003C/span\u003E\u003Cspan class=\"\"\u003Ep45.nl\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E\u003C/span\u003E\u003C/a\u003E",
          "verified_at": null
        },
        {
          "name": "Github",
          "value": "\u003Ca href=\"https://github.com/panomaki\" target=\"_blank\" rel=\"nofollow noopener\" translate=\"no\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://\u003C/span\u003E\u003Cspan class=\"\"\u003Egithub.com/panomaki\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E\u003C/span\u003E\u003C/a\u003E",
          "verified_at": "2025-09-26T18:32:31.964+00:00"
        },
        {
          "name": "Nacht van de Vluchteling",
          "value": "\u003Ca href=\"https://www.nachtvandevluchteling.nl/fundraisers/patrick-dersjant\" rel=\"nofollow noopener\" translate=\"no\" target=\"_blank\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://www.\u003C/span\u003E\u003Cspan class=\"ellipsis\"\u003Enachtvandevluchteling.nl/fundr\u003C/span\u003E\u003Cspan class=\"invisible\"\u003Eaisers/patrick-dersjant\u003C/span\u003E\u003C/a\u003E",
          "verified_at": null
        }
      ]
    },
    "media_attachments": [],
    "mentions": [],
    "tags": [
      {
        "name": "guessthestation",
        "url": "https://mastodon.social/tags/guessthestation"
      },
      {
        "name": "interrail",
        "url": "https://mastodon.social/tags/interrail"
      },
      {
        "name": "swissalps",
        "url": "https://mastodon.social/tags/swissalps"
      }
    ],
    "emojis": [],
    "quote": null,
    "card": null,
    "poll": null,
    "quote_approval": {
      "automatic": [],
      "manual": [],
      "current_user": "denied"
    }
  },
  {
    "id": "115280709570766954",
    "created_at": "2025-09-28T07:20:30.314Z",
    "in_reply_to_id": null,
    "in_reply_to_account_id": null,
    "sensitive": false,
    "spoiler_text": "",
    "visibility": "public",
    "language": "en",
    "uri": "https://mastodon.social/users/WrongSopranosFacts/statuses/115280709570766954",
    "url": "https://mastodon.social/@WrongSopranosFacts/115280709570766954",
    "replies_count": 0,
    "reblogs_count": 0,
    "favourites_count": 0,
    "quotes_count": 0,
    "edited_at": null,
    "content": "\u003Cp\u003EFurio is a &quot;real estate manager&quot; and is at Vesuvio in season 4 ep 2\u003C/p\u003E",
    "reblog": null,
    "application": {
      "name": "CheapBotsTootSweet",
      "website": null
    },
    "account": {
      "id": "109906346774423664",
      "username": "WrongSopranosFacts",
      "acct": "WrongSopranosFacts",
      "display_name": "WrongSopranosFacts",
      "locked": false,
      "bot": true,
      "discoverable": false,
      "indexable": false,
      "group": false,
      "created_at": "2023-02-22T00:00:00.000Z",
      "note": "\u003Cp\u003EThis bot gives you wrong facts about the t.v. Show The Sopranos...but sometimes it gets it right\u003C/p\u003E",
      "url": "https://mastodon.social/@WrongSopranosFacts",
      "uri": "https://mastodon.social/users/WrongSopranosFacts",
      "avatar": "https://files.mastodon.social/accounts/avatars/109/906/346/774/423/664/original/f509430060b6aa3c.jpg",
      "avatar_static": "https://files.mastodon.social/accounts/avatars/109/906/346/774/423/664/original/f509430060b6aa3c.jpg",
      "header": "https://files.mastodon.social/accounts/headers/109/906/346/774/423/664/original/e4eaa2360ba4b1b0.jpeg",
      "header_static": "https://files.mastodon.social/accounts/headers/109/906/346/774/423/664/original/e4eaa2360ba4b1b0.jpeg",
      "followers_count": 15,
      "following_count": 0,
      "statuses_count": 20421,
      "last_status_at": "2025-09-28",
      "hide_collections": false,
      "noindex": false,
      "emojis": [],
      "roles": [],
      "fields": []
    },
    "media_attachments": [],
    "mentions": [],
    "tags": [],
    "emojis": [],
    "quote": null,
    "card": null,
    "poll": null,
    "quote_approval": {
      "automatic": [
        "public"
      ],
      "manual": [],
      "current_user": "denied"
    }
  },
  {
    "id": "115280709540668486",
    "created_at": "2025-09-28T07:20:29.856Z",
    "in_reply_to_id": null,
    "in_reply_to_account_id": null,
    "sensitive": false,
    "spoiler_text": "",
    "visibility": "public",
    "language": "en",
    "uri": "https://mastodon.social/users/willwoodlyric/statuses/115280709540668486",
    "url": "https://mastodon.social/@willwoodlyric/115280709540668486",
    "replies_count": 0,
    "reblogs_count": 0,
    "favourites_count": 0,
    "quotes_count": 0,
    "edited_at": null,
    "content": "\u003Cp\u003EAnd we’re looking through the pockets of the hand-me-downs we laid out wondering if we’ll fit into the yesterdays we played out\u003C/p\u003E",
    "reblog": null,
    "application": {
      "name": "CheapBotsTootSweet",
      "website": null
    },
    "account": {
      "id": "110151017522373005",
      "username": "willwoodlyric",
      "acct": "willwoodlyric",
      "display_name": "Will Wood Lyric Bot",
      "locked": false,
      "bot": true,
      "discoverable": true,
      "indexable": false,
      "group": false,
      "created_at": "2023-04-06T00:00:00.000Z",
      "note": "\u003Cp\u003EWill Wood Lyric bot - Posts a lyric every hour\u003C/p\u003E",
      "url": "https://mastodon.social/@willwoodlyric",
      "uri": "https://mastodon.social/users/willwoodlyric",
      "avatar": "https://files.mastodon.social/accounts/avatars/110/151/017/522/373/005/original/e089bcf28c332ad6.jpg",
      "avatar_static": "https://files.mastodon.social/accounts/avatars/110/151/017/522/373/005/original/e089bcf28c332ad6.jpg",
      "header": "https://files.mastodon.social/accounts/headers/110/151/017/522/373/005/original/ef122827dd78c3d0.jpg",
      "header_static": "https://files.mastodon.social/accounts/headers/110/151/017/522/373/005/original/ef122827dd78c3d0.jpg",
      "followers_count": 27,
      "following_count": 0,
      "statuses_count": 19589,
      "last_status_at": "2025-09-28",
      "hide_collections": false,
      "noindex": false,
      "emojis": [],
      "roles": [],
      "fields": []
    },
    "media_attachments": [],
    "mentions": [],
    "tags": [],
    "emojis": [],
    "quote": null,
    "card": null,
    "poll": null,
    "quote_approval": {
      "automatic": [
        "public"
      ],
      "manual": [],
      "current_user": "denied"
    }
  },
  {
    "id": "115280709525316633",
    "created_at": "2025-09-28T07:20:29.620Z",
    "in_reply_to_id": null,
    "in_reply_to_account_id": null,
    "sensitive": false,
    "spoiler_text": "",
    "visibility": "public",
    "language": "de",
    "uri": "https://mastodon.social/users/newsde/statuses/115280709525316633",
    "url": "https://mastodon.social/@newsde/115280709525316633",
    "replies_count": 0,
    "reblogs_count": 0,
    "favourites_count": 0,
    "quotes_count": 0,
    "edited_at": null,
    "content": "\u003Cp\u003EDie neue Corona-Variante Stratus breitet sich aktuell rasant aus. Doch nicht nur Covid grassiert, auch andere Krankheiten sind auf dem Vormarsch. Experten warnen bereits vor einer Dreifach-Epidemie. Diese Symptome sollten Sie ernst nehmen.\u003C/p\u003E",
    "reblog": null,
    "application": {
      "name": "CleverPush",
      "website": "https://cleverpush.com"
    },
    "account": {
      "id": "114573762817681296",
      "username": "newsde",
      "acct": "newsde",
      "display_name": "news.de",
      "locked": false,
      "bot": false,
      "discoverable": true,
      "indexable": true,
      "group": false,
      "created_at": "2025-05-26T00:00:00.000Z",
      "note": "\u003Cp\u003EMehr als Nachrichten! \u003Ca href=\"https://mastodon.social/tags/newsde\" class=\"mention hashtag\" rel=\"tag\"\u003E#\u003Cspan\u003Enewsde\u003C/span\u003E\u003C/a\u003E\u003Cbr /\u003EHier geht&#39;s zum Impressum:\u003Cbr /\u003E\u003Ca href=\"https://www.news.de/service/imprint/\" target=\"_blank\" rel=\"nofollow noopener\" translate=\"no\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://www.\u003C/span\u003E\u003Cspan class=\"\"\u003Enews.de/service/imprint/\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E\u003C/span\u003E\u003C/a\u003E\u003C/p\u003E",
      "url": "https://mastodon.social/@newsde",
      "uri": "https://mastodon.social/users/newsde",
      "avatar": "https://files.mastodon.social/accounts/avatars/114/573/762/817/681/296/original/3b6ac6d045f871ec.jpg",
      "avatar_static": "https://files.mastodon.social/accounts/avatars/114/573/762/817/681/296/original/3b6ac6d045f871ec.jpg",
      "header": "https://mastodon.social/headers/original/missing.png",
      "header_static": "https://mastodon.social/headers/original/missing.png",
      "followers_count": 12,
      "following_count": 3,
      "statuses_count": 8715,
      "last_status_at": "2025-09-28",
      "hide_collections": null,
      "noindex": false,
      "emojis": [],
      "roles": [],
      "fields": []
    },
    "media_attachments": [
      {
        "id": "115280709443371969",
        "type": "image",
        "url": "https://files.mastodon.social/media_attachments/files/115/280/709/443/371/969/original/f866e62f53374dde.jpeg",
        "preview_url": "https://files.mastodon.social/media_attachments/files/115/280/709/443/371/969/small/f866e62f53374dde.jpeg",
        "remote_url": null,
        "preview_remote_url": null,
        "text_url": null,
        "meta": {
          "original": {
            "width": 1200,
            "height": 675,
            "size": "1200x675",
            "aspect": 1.77777777777778
          },
          "small": {
            "width": 640,
            "height": 360,
            "size": "640x360",
            "aspect": 1.77777777777778
          }
        },
        "description": null,
        "blurhash": "UNH3OS_MY3OZt-_0Myx[pIJBw@$%oK$*v}It"
      }
    ],
    "mentions": [],
    "tags": [],
    "emojis": [],
    "quote": null,
    "card": null,
    "poll": null,
    "quote_approval": {
      "automatic": [
        "public"
      ],
      "manual": [],
      "current_user": "denied"
    }
  },
  {
    "id": "115280709522381735",
    "created_at": "2025-09-28T07:20:29.576Z",
    "in_reply_to_id": null,
    "in_reply_to_account_id": null,
    "sensitive": false,
    "spoiler_text": "",
    "visibility": "public",
    "language": "es",
    "uri": "https://mastodon.social/users/viajes_chilanbotpolis/statuses/115280709522381735",
    "url": "https://mastodon.social/@viajes_chilanbotpolis/115280709522381735",
    "replies_count": 0,
    "reblogs_count": 0,
    "favourites_count": 0,
    "quotes_count": 0,
    "edited_at": null,
    "content": "\u003Cp\u003EEl domingo llegó un extraterrestre a la Bondojito en limusina. Al llegar fue a comprar chelas. \u003Cbr /\u003EDice que le encantó.\u003C/p\u003E",
    "reblog": null,
    "application": {
      "name": "CheapBotsTootSweet",
      "website": null
    },
    "account": {
      "id": "1002119",
      "username": "viajes_chilanbotpolis",
      "acct": "viajes_chilanbotpolis",
      "display_name": "Bot viajero en Chilangolandia",
      "locked": false,
      "bot": true,
      "discoverable": true,
      "indexable": false,
      "group": false,
      "created_at": "2019-11-15T00:00:00.000Z",
      "note": "\u003Cp\u003ESoy un bot creado en un taller del CCD. \u003Cbr /\u003ECuento viajes en CDMX y también digo algunas pendejadas.\u003C/p\u003E",
      "url": "https://mastodon.social/@viajes_chilanbotpolis",
      "uri": "https://mastodon.social/users/viajes_chilanbotpolis",
      "avatar": "https://files.mastodon.social/accounts/avatars/001/002/119/original/6dda8058d99be1b5.jpg",
      "avatar_static": "https://files.mastodon.social/accounts/avatars/001/002/119/original/6dda8058d99be1b5.jpg",
      "header": "https://files.mastodon.social/accounts/headers/001/002/119/original/4db2419c3e4317e7.png",
      "header_static": "https://files.mastodon.social/accounts/headers/001/002/119/original/4db2419c3e4317e7.png",
      "followers_count": 61,
      "following_count": 3,
      "statuses_count": 39687,
      "last_status_at": "2025-09-28",
      "hide_collections": null,
      "noindex": false,
      "emojis": [],
      "roles": [],
      "fields": []
    },
    "media_attachments": [],
    "mentions": [],
    "tags": [],
    "emojis": [],
    "quote": null,
    "card": null,
    "poll": null,
    "quote_approval": {
      "automatic": [
        "public"
      ],
      "manual": [],
      "current_user": "denied"
    }
  },
  {
    "id": "115280709515285783",
    "created_at": "2025-09-28T07:20:29.483Z",
    "in_reply_to_id": null,
    "in_reply_to_account_id": null,
    "sensitive": false,
    "spoiler_text": "",
    "visibility": "public",
    "language": "es",
    "uri": "https://mastodon.social/users/daletraesp/statuses/115280709515285783",
    "url": "https://mastodon.social/@daletraesp/115280709515285783",
    "replies_count": 0,
    "reblogs_count": 0,
    "favourites_count": 0,
    "quotes_count": 0,
    "edited_at": null,
    "content": "\u003Cp\u003ELetra de la canción “Incomplete” de Backstreet Boys\u003Cbr /\u003E\u003Ca href=\"https://mastodon.social/tags/BackstreetBoys\" class=\"mention hashtag\" rel=\"tag\"\u003E#\u003Cspan\u003EBackstreetBoys\u003C/span\u003E\u003C/a\u003E \u003Ca href=\"https://mastodon.social/tags/Incomplete\" class=\"mention hashtag\" rel=\"tag\"\u003E#\u003Cspan\u003EIncomplete\u003C/span\u003E\u003C/a\u003E\u003Cbr /\u003E\u003Ca href=\"https://daletra.net/backstreet-boys/letras/incomplete.html\" target=\"_blank\" rel=\"nofollow noopener\" translate=\"no\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://\u003C/span\u003E\u003Cspan class=\"ellipsis\"\u003Edaletra.net/backstreet-boys/le\u003C/span\u003E\u003Cspan class=\"invisible\"\u003Etras/incomplete.html\u003C/span\u003E\u003C/a\u003E\u003C/p\u003E",
    "reblog": null,
    "application": {
      "name": "DaLetra - Letras, Música, Vídeos y mucho más",
      "website": "https://daletra.net"
    },
    "account": {
      "id": "112304978638392761",
      "username": "daletraesp",
      "acct": "daletraesp",
      "display_name": "DaLetra Español",
      "locked": false,
      "bot": false,
      "discoverable": true,
      "indexable": true,
      "group": false,
      "created_at": "2024-04-20T00:00:00.000Z",
      "note": "\u003Cp\u003ELetras, Música, Vídeos y mucho más\u003C/p\u003E",
      "url": "https://mastodon.social/@daletraesp",
      "uri": "https://mastodon.social/users/daletraesp",
      "avatar": "https://files.mastodon.social/accounts/avatars/112/304/978/638/392/761/original/b441fdc2379d0277.png",
      "avatar_static": "https://files.mastodon.social/accounts/avatars/112/304/978/638/392/761/original/b441fdc2379d0277.png",
      "header": "https://files.mastodon.social/accounts/headers/112/304/978/638/392/761/original/ede815d4e0fbc953.png",
      "header_static": "https://files.mastodon.social/accounts/headers/112/304/978/638/392/761/original/ede815d4e0fbc953.png",
      "followers_count": 31,
      "following_count": 0,
      "statuses_count": 24500,
      "last_status_at": "2025-09-28",
      "hide_collections": false,
      "noindex": false,
      "emojis": [],
      "roles": [],
      "fields": [
        {
          "name": "Site",
          "value": "\u003Ca href=\"https://daletra.net\" target=\"_blank\" rel=\"nofollow noopener me\" translate=\"no\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://\u003C/span\u003E\u003Cspan class=\"\"\u003Edaletra.net\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E\u003C/span\u003E\u003C/a\u003E",
          "verified_at": "2024-04-20T18:47:14.175+00:00"
        },
        {
          "name": "Twitter",
          "value": "\u003Ca href=\"https://twitter.com/daletraesp\" target=\"_blank\" rel=\"nofollow noopener me\" translate=\"no\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://\u003C/span\u003E\u003Cspan class=\"\"\u003Etwitter.com/daletraesp\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E\u003C/span\u003E\u003C/a\u003E",
          "verified_at": null
        },
        {
          "name": "Facebook",
          "value": "\u003Ca href=\"https://www.facebook.com/daletraesp\" target=\"_blank\" rel=\"nofollow noopener me\" translate=\"no\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://www.\u003C/span\u003E\u003Cspan class=\"\"\u003Efacebook.com/daletraesp\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E\u003C/span\u003E\u003C/a\u003E",
          "verified_at": null
        },
        {
          "name": "Chrome Extension",
          "value": "\u003Ca href=\"https://chromewebstore.google.com/detail/daletra/lcioafeiamefbahhokaphlpoebdiihoj/reviews/1\" target=\"_blank\" rel=\"nofollow noopener me\" translate=\"no\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://\u003C/span\u003E\u003Cspan class=\"ellipsis\"\u003Echromewebstore.google.com/deta\u003C/span\u003E\u003Cspan class=\"invisible\"\u003Eil/daletra/lcioafeiamefbahhokaphlpoebdiihoj/reviews/1\u003C/span\u003E\u003C/a\u003E",
          "verified_at": null
        }
      ]
    },
    "media_attachments": [
      {
        "id": "115280709290536864",
        "type": "image",
        "url": "https://files.mastodon.social/media_attachments/files/115/280/709/290/536/864/original/542354873aff0ffb.webp",
        "preview_url": "https://files.mastodon.social/media_attachments/files/115/280/709/290/536/864/small/542354873aff0ffb.webp",
        "remote_url": null,
        "preview_remote_url": null,
        "text_url": null,
        "meta": {
          "original": {
            "width": 500,
            "height": 500,
            "size": "500x500",
            "aspect": 1
          },
          "small": {
            "width": 480,
            "height": 480,
            "size": "480x480",
            "aspect": 1
          }
        },
        "description": null,
        "blurhash": "UiIOC0R:Wot7_NWsn$of?bWFodWXfkRkR*f+"
      }
    ],
    "mentions": [],
    "tags": [
      {
        "name": "backstreetboys",
        "url": "https://mastodon.social/tags/backstreetboys"
      },
      {
        "name": "incomplete",
        "url": "https://mastodon.social/tags/incomplete"
      }
    ],
    "emojis": [],
    "quote": null,
    "card": null,
    "poll": null,
    "quote_approval": {
      "automatic": [
        "public"
      ],
      "manual": [],
      "current_user": "denied"
    }
  },
  {
    "id": "115280709514785882",
    "created_at": "2025-09-28T07:20:29.473Z",
    "in_reply_to_id": null,
    "in_reply_to_account_id": null,
    "sensitive": false,
    "spoiler_text": "",
    "visibility": "public",
    "language": "de",
    "uri": "https://mastodon.social/users/OnkelBobbyWhite/statuses/115280709514785882",
    "url": "https://mastodon.social/@OnkelBobbyWhite/115280709514785882",
    "replies_count": 0,
    "reblogs_count": 0,
    "favourites_count": 0,
    "quotes_count": 0,
    "edited_at": null,
    "content": "\u003Cp\u003EI&#39;ve watched this movie for at least the 1,500th time now, and I still can&#39;t get enough of the best movie of all time. Today I&#39;m watching it for breakfast with cornflakes.\u003C/p\u003E\u003Cp\u003E\u003Ca href=\"https://mastodon.social/tags/Tmnt\" class=\"mention hashtag\" rel=\"tag\"\u003E#\u003Cspan\u003ETmnt\u003C/span\u003E\u003C/a\u003E \u003Ca href=\"https://mastodon.social/tags/ninjaturtles\" class=\"mention hashtag\" rel=\"tag\"\u003E#\u003Cspan\u003Eninjaturtles\u003C/span\u003E\u003C/a\u003E \u003Ca href=\"https://mastodon.social/tags/turtlesmovie\" class=\"mention hashtag\" rel=\"tag\"\u003E#\u003Cspan\u003Eturtlesmovie\u003C/span\u003E\u003C/a\u003E \u003Ca href=\"https://mastodon.social/tags/saturdaymorningcartoons\" class=\"mention hashtag\" rel=\"tag\"\u003E#\u003Cspan\u003Esaturdaymorningcartoons\u003C/span\u003E\u003C/a\u003E\u003C/p\u003E",
    "reblog": null,
    "application": {
      "name": "Mastodon for Android",
      "website": "https://app.joinmastodon.org/android"
    },
    "account": {
      "id": "113449692022169217",
      "username": "OnkelBobbyWhite",
      "acct": "OnkelBobbyWhite",
      "display_name": "OnkelBobbyWhite",
      "locked": false,
      "bot": false,
      "discoverable": true,
      "indexable": true,
      "group": false,
      "created_at": "2024-11-08T00:00:00.000Z",
      "note": "\u003Cp\u003E\u003Ca href=\"https://mastodon.social/tags/Kiffer\" class=\"mention hashtag\" rel=\"tag\"\u003E#\u003Cspan\u003EKiffer\u003C/span\u003E\u003C/a\u003E / \u003Ca href=\"https://mastodon.social/tags/Stoner\" class=\"mention hashtag\" rel=\"tag\"\u003E#\u003Cspan\u003EStoner\u003C/span\u003E\u003C/a\u003E 🥦💚🍁\u003Cbr /\u003E\u003Ca href=\"https://mastodon.social/tags/Musicjunkie\" class=\"mention hashtag\" rel=\"tag\"\u003E#\u003Cspan\u003EMusicjunkie\u003C/span\u003E\u003C/a\u003E 🎧\u003Cbr /\u003E\u003Ca href=\"https://mastodon.social/tags/Pizza\" class=\"mention hashtag\" rel=\"tag\"\u003E#\u003Cspan\u003EPizza\u003C/span\u003E\u003C/a\u003E ❤️🍕\u003Cbr /\u003E\u003Ca href=\"https://mastodon.social/tags/Skater\" class=\"mention hashtag\" rel=\"tag\"\u003E#\u003Cspan\u003ESkater\u003C/span\u003E\u003C/a\u003E 🛹\u003Cbr /\u003E\u003Ca href=\"https://mastodon.social/tags/RetroGamer\" class=\"mention hashtag\" rel=\"tag\"\u003E#\u003Cspan\u003ERetroGamer\u003C/span\u003E\u003C/a\u003E \u003Cbr /\u003E\u003Ca href=\"https://mastodon.social/tags/GameBoy\" class=\"mention hashtag\" rel=\"tag\"\u003E#\u003Cspan\u003EGameBoy\u003C/span\u003E\u003C/a\u003E \u003Cbr /\u003E\u003Ca href=\"https://mastodon.social/tags/C64\" class=\"mention hashtag\" rel=\"tag\"\u003E#\u003Cspan\u003EC64\u003C/span\u003E\u003C/a\u003E\u003Cbr /\u003E\u003Ca href=\"https://mastodon.social/tags/Tetris\" class=\"mention hashtag\" rel=\"tag\"\u003E#\u003Cspan\u003ETetris\u003C/span\u003E\u003C/a\u003E \u003C/p\u003E\u003Cp\u003E \u003C/p\u003E\u003Cp\u003EOld account: \u003Ca href=\"https://social.vivaldi.net/@OnkelBobbyWhite\" target=\"_blank\" rel=\"nofollow noopener\" translate=\"no\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://\u003C/span\u003E\u003Cspan class=\"ellipsis\"\u003Esocial.vivaldi.net/@OnkelBobby\u003C/span\u003E\u003Cspan class=\"invisible\"\u003EWhite\u003C/span\u003E\u003C/a\u003E\u003C/p\u003E\u003Cp\u003EYT:\u003Cbr /\u003E \u003Ca href=\"https://youtube.com/@onkelbobbywhite2007?si=fOHiUAkuXXEkaWUs\" target=\"_blank\" rel=\"nofollow noopener\" translate=\"no\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://\u003C/span\u003E\u003Cspan class=\"ellipsis\"\u003Eyoutube.com/@onkelbobbywhite20\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E07?si=fOHiUAkuXXEkaWUs\u003C/span\u003E\u003C/a\u003E\u003C/p\u003E\u003Cp\u003ETwitch: \u003Cbr /\u003E\u003Ca href=\"https://www.twitch.tv/onkelbobbywhite\" target=\"_blank\" rel=\"nofollow noopener\" translate=\"no\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://www.\u003C/span\u003E\u003Cspan class=\"\"\u003Etwitch.tv/onkelbobbywhite\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E\u003C/span\u003E\u003C/a\u003E\u003C/p\u003E",
      "url": "https://mastodon.social/@OnkelBobbyWhite",
      "uri": "https://mastodon.social/users/OnkelBobbyWhite",
      "avatar": "https://files.mastodon.social/accounts/avatars/113/449/692/022/169/217/original/4d644bf19efe4393.jpg",
      "avatar_static": "https://files.mastodon.social/accounts/avatars/113/449/692/022/169/217/original/4d644bf19efe4393.jpg",
      "header": "https://files.mastodon.social/accounts/headers/113/449/692/022/169/217/original/494b001565ec3184.gif",
      "header_static": "https://files.mastodon.social/accounts/headers/113/449/692/022/169/217/static/494b001565ec3184.png",
      "followers_count": 28,
      "following_count": 50,
      "statuses_count": 745,
      "last_status_at": "2025-09-28",
      "hide_collections": null,
      "noindex": false,
      "emojis": [],
      "roles": [],
      "fields": []
    },
    "media_attachments": [
      {
        "id": "115280703497479203",
        "type": "image",
        "url": "https://files.mastodon.social/media_attachments/files/115/280/703/497/479/203/original/73bba06ad4ea3b43.jpg",
        "preview_url": "https://files.mastodon.social/media_attachments/files/115/280/703/497/479/203/small/73bba06ad4ea3b43.jpg",
        "remote_url": null,
        "preview_remote_url": null,
        "text_url": null,
        "meta": {
          "original": {
            "width": 3325,
            "height": 2494,
            "size": "3325x2494",
            "aspect": 1.33319967923015
          },
          "small": {
            "width": 554,
            "height": 416,
            "size": "554x416",
            "aspect": 1.33173076923077
          }
        },
        "description": "Turtles 1990",
        "blurhash": "UR8P1OyDi^RStmWVj]j?HqMco#tQr[i^kCWX"
      }
    ],
    "mentions": [],
    "tags": [
      {
        "name": "tmnt",
        "url": "https://mastodon.social/tags/tmnt"
      },
      {
        "name": "ninjaturtles",
        "url": "https://mastodon.social/tags/ninjaturtles"
      },
      {
        "name": "turtlesmovie",
        "url": "https://mastodon.social/tags/turtlesmovie"
      },
      {
        "name": "saturdaymorningcartoons",
        "url": "https://mastodon.social/tags/saturdaymorningcartoons"
      }
    ],
    "emojis": [],
    "quote": null,
    "card": null,
    "poll": null,
    "quote_approval": {
      "automatic": [
        "public"
      ],
      "manual": [],
      "current_user": "denied"
    }
  },
  {
    "id": "115280709484075151",
    "created_at": "2025-09-28T07:20:28.000Z",
    "in_reply_to_id": null,
    "in_reply_to_account_id": null,
    "sensitive": false,
    "spoiler_text": "",
    "visibility": "public",
    "language": "de",
    "uri": "https://ruhr.social/users/franckraisch/statuses/115280709435670530",
    "url": "https://ruhr.social/@franckraisch/115280709435670530",
    "replies_count": 0,
    "reblogs_count": 0,
    "favourites_count": 0,
    "quotes_count": 0,
    "edited_at": null,
    "content": "\u003Cp\u003EKopf denkt noch nicht \u003Cbr\u003EGridWords (28. September 2025) 6/6 in 10:01 🔥1\u003C/p\u003E\u003Cp\u003E⬜⬜🟨⬜⬜\u003Cbr\u003E⬜🟨⬜🟨🟨\u003Cbr\u003E⬜⬜🟨🟨🟨\u003Cbr\u003E🟩🟩⬜🟩⬜\u003Cbr\u003E🟩🟩🟩🟩⬜\u003Cbr\u003E🟩🟩🟩🟩🟩\u003C/p\u003E\u003Cp\u003E\u003Ca href=\"https://gridgames.app/gridwords/\" rel=\"nofollow noopener\" translate=\"no\" target=\"_blank\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://\u003C/span\u003E\u003Cspan class=\"\"\u003Egridgames.app/gridwords/\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E\u003C/span\u003E\u003C/a\u003E\u003C/p\u003E",
    "reblog": null,
    "account": {
      "id": "109241680298527021",
      "username": "franckraisch",
      "acct": "franckraisch@ruhr.social",
      "display_name": "FranckRaisch",
      "locked": false,
      "bot": false,
      "discoverable": true,
      "indexable": true,
      "group": false,
      "created_at": "2022-10-27T00:00:00.000Z",
      "note": "\u003Cp\u003EBonjour, irgendwas muss hier ja stehen. \u003Ca href=\"https://ruhr.social/tags/TeamWissenschaft\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003ETeamWissenschaft\u003C/span\u003E\u003C/a\u003E oder Anti-Sackwurstzirkel. Keine Nazis, keine FDP. Typische Tippfehler und gelegentliche Gefühlsausbrüche in jede Richtung. Warnung vor dem Hunde. Born 320.2 ppm \u003Ca href=\"https://ruhr.social/tags/NichtAlleTassenImSchrank\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003ENichtAlleTassenImSchrank\u003C/span\u003E\u003C/a\u003E Beiträge werden nach einem Jahr gelöscht\u003C/p\u003E",
      "url": "https://ruhr.social/@franckraisch",
      "uri": "https://ruhr.social/users/franckraisch",
      "avatar": "https://files.mastodon.social/cache/accounts/avatars/109/241/680/298/527/021/original/ab2104e3335b4fcc.png",
      "avatar_static": "https://files.mastodon.social/cache/accounts/avatars/109/241/680/298/527/021/original/ab2104e3335b4fcc.png",
      "header": "https://files.mastodon.social/cache/accounts/headers/109/241/680/298/527/021/original/5a49d9d7392926db.png",
      "header_static": "https://files.mastodon.social/cache/accounts/headers/109/241/680/298/527/021/original/5a49d9d7392926db.png",
      "followers_count": 610,
      "following_count": 568,
      "statuses_count": 7371,
      "last_status_at": "2025-09-28",
      "hide_collections": false,
      "emojis": [],
      "fields": []
    },
    "media_attachments": [],
    "mentions": [],
    "tags": [],
    "emojis": [],
    "quote": null,
    "card": null,
    "poll": null,
    "quote_approval": {
      "automatic": [],
      "manual": [],
      "current_user": "denied"
    }
  },
  {
    "id": "115280709466585080",
    "created_at": "2025-09-28T07:20:28.344Z",
    "in_reply_to_id": null,
    "in_reply_to_account_id": null,
    "sensitive": false,
    "spoiler_text": "",
    "visibility": "public",
    "language": null,
    "uri": "https://fedi.lunya.pet/notes/ad6xpk8oxt",
    "url": "https://fedi.lunya.pet/notes/ad6xpk8oxt",
    "replies_count": 0,
    "reblogs_count": 0,
    "favourites_count": 0,
    "quotes_count": 0,
    "edited_at": null,
    "content": "\u003Cp\u003E\u003Cspan\u003Ebronze is then why nothing executable\u003Cbr\u003Ewhat could spin up but don't remember hearing about me to be able to ride and inconvenient enough for a warning sign up\u003C/span\u003E\u003C/p\u003E",
    "reblog": null,
    "account": {
      "id": "114782611689535158",
      "username": "collabmarkov",
      "acct": "collabmarkov@fedi.lunya.pet",
      "display_name": "Collaborative Markov Bot",
      "locked": false,
      "bot": true,
      "discoverable": true,
      "indexable": true,
      "group": false,
      "created_at": "2025-07-02T00:00:00.000Z",
      "note": "\u003Cp\u003E\u003Cspan\u003EFollow this account to contribute to the mess that is Collaborative Markov. All of your public posts will be included once you follow this bot. Markov notes posted by this bot are \"sanitized\", all open formatting is closed on each end of line.\u003Cbr\u003E\u003Cbr\u003EIf you want to follow this bot without it interacting with you, simply add \u003C/span\u003E\u003Ca href=\"https://fedi.lunya.pet/tags/NoMarkov\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#NoMarkov\u003C/a\u003E\u003Cspan\u003E into your bio :3\u003Cbr\u003E\u003Cbr\u003EThe bot will only include posts without a content warning and that are posted with the public visibility, posts with home visibility aren't included!\u003Cbr\u003E\u003Cbr\u003EPosts have a bit of post-processing added to them, mainly sanitizing formatting, disabling mentions and hashtags.\u003Cbr\u003E\u003Cbr\u003E\u003C/span\u003E\u003Cb\u003EPlease report any posts that should have a CW or are bad, either through the instance or by \u003Ca href=\"https://fedi.lunya.pet/@meow@fedi.lunya.pet\" class=\"u-url mention\" rel=\"nofollow noopener\" target=\"_blank\"\u003E@meow@fedi.lunya.pet\u003C/a\u003E :3\u003C/b\u003E\u003C/p\u003E",
      "url": "https://fedi.lunya.pet/@collabmarkov",
      "uri": "https://fedi.lunya.pet/users/a9p88ezq29",
      "avatar": "https://files.mastodon.social/cache/accounts/avatars/114/782/611/689/535/158/original/d984530017732878.png",
      "avatar_static": "https://files.mastodon.social/cache/accounts/avatars/114/782/611/689/535/158/original/d984530017732878.png",
      "header": "https://files.mastodon.social/cache/accounts/headers/114/782/611/689/535/158/original/57e93a294a4a1581.png",
      "header_static": "https://files.mastodon.social/cache/accounts/headers/114/782/611/689/535/158/original/57e93a294a4a1581.png",
      "followers_count": 268,
      "following_count": 284,
      "statuses_count": 1981,
      "last_status_at": "2025-09-28",
      "hide_collections": false,
      "emojis": [],
      "fields": [
        {
          "name": "developer",
          "value": "\u003Ca href=\"https://fedi.lunya.pet/@meow@fedi.lunya.pet\" class=\"u-url mention\" rel=\"nofollow noopener\" target=\"_blank\"\u003E@meow@fedi.lunya.pet\u003C/a\u003E",
          "verified_at": null
        },
        {
          "name": "source code",
          "value": "\u003Ca href=\"https://git.lunya.pet/Lunya/collabmarkov\" rel=\"nofollow noopener\" target=\"_blank\"\u003Ehttps://git.lunya.pet/Lunya/collabmarkov\u003C/a\u003E",
          "verified_at": null
        }
      ]
    },
    "media_attachments": [],
    "mentions": [],
    "tags": [],
    "emojis": [],
    "quote": null,
    "card": null,
    "poll": null,
    "quote_approval": {
      "automatic": [],
      "manual": [],
      "current_user": "denied"
    }
  },
  {
    "id": "115280709464390879",
    "created_at": "2025-09-28T07:20:28.000Z",
    "in_reply_to_id": null,
    "in_reply_to_account_id": null,
    "sensitive": false,
    "spoiler_text": "",
    "visibility": "public",
    "language": "en",
    "uri": "https://mastodon.art/users/OlkaAAKH/statuses/115280709444071509",
    "url": "https://mastodon.art/@OlkaAAKH/115280709444071509",
    "replies_count": 0,
    "reblogs_count": 1,
    "favourites_count": 0,
    "quotes_count": 0,
    "edited_at": null,
    "content": "\u003Cp\u003EWordle 1,562 5/6\u003C/p\u003E\u003Cp\u003E⬛⬛🟨⬛⬛\u003Cbr\u003E🟨⬛⬛⬛🟩\u003Cbr\u003E⬛🟨⬛⬛🟩\u003Cbr\u003E⬛🟩🟨🟩🟩\u003Cbr\u003E🟩🟩🟩🟩🟩\u003C/p\u003E\u003Cp\u003E\u003Ca href=\"https://mastodon.art/tags/Wordle\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003EWordle\u003C/span\u003E\u003C/a\u003E\u003Cbr\u003E\u003Ca href=\"https://mastodon.art/tags/WordleWarriors\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003EWordleWarriors\u003C/span\u003E\u003C/a\u003E\u003C/p\u003E",
    "reblog": null,
    "account": {
      "id": "109813508593661523",
      "username": "OlkaAAKH",
      "acct": "OlkaAAKH@mastodon.art",
      "display_name": "Olka",
      "locked": false,
      "bot": false,
      "discoverable": true,
      "indexable": false,
      "group": false,
      "created_at": "2023-02-05T00:00:00.000Z",
      "note": "\u003Cp\u003EMusic. Coffee. Self taught at drawing. \u003Cbr\u003ELuis Royo and Boris Vallejo are my favourite artists.\u003Cbr\u003EI take photos occasionally. \u003Cbr\u003EBlack and white art has always had my respect and admiration.\u003Cbr\u003EAromatherapy is my addiction.\u003C/p\u003E\u003Cp\u003E\u003Ca href=\"https://mastodon.art/tags/pencildrawing\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003Epencildrawing\u003C/span\u003E\u003C/a\u003E\u003Cbr\u003E\u003Ca href=\"https://mastodon.art/tags/photography\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003Ephotography\u003C/span\u003E\u003C/a\u003E\u003Cbr\u003E\u003Ca href=\"https://mastodon.art/tags/Animals\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003EAnimals\u003C/span\u003E\u003C/a\u003E \u003Ca href=\"https://mastodon.art/tags/Nature\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003ENature\u003C/span\u003E\u003C/a\u003E \u003Ca href=\"https://mastodon.art/tags/Amber\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003EAmber\u003C/span\u003E\u003C/a\u003E\u003Cbr\u003E\u003Ca href=\"https://mastodon.art/tags/Aromatherapy\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003EAromatherapy\u003C/span\u003E\u003C/a\u003E \u003Ca href=\"https://mastodon.art/tags/PureEssentialOils\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003EPureEssentialOils\u003C/span\u003E\u003C/a\u003E\u003Cbr\u003E\u003Ca href=\"https://mastodon.art/tags/Tattoos\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003ETattoos\u003C/span\u003E\u003C/a\u003E\u003C/p\u003E",
      "url": "https://mastodon.art/@OlkaAAKH",
      "uri": "https://mastodon.art/users/OlkaAAKH",
      "avatar": "https://files.mastodon.social/cache/accounts/avatars/109/813/508/593/661/523/original/817b09f2dd9754bf.jpg",
      "avatar_static": "https://files.mastodon.social/cache/accounts/avatars/109/813/508/593/661/523/original/817b09f2dd9754bf.jpg",
      "header": "https://files.mastodon.social/cache/accounts/headers/109/813/508/593/661/523/original/b1a84dab6e441848.jpg",
      "header_static": "https://files.mastodon.social/cache/accounts/headers/109/813/508/593/661/523/original/b1a84dab6e441848.jpg",
      "followers_count": 82,
      "following_count": 188,
      "statuses_count": 713,
      "last_status_at": "2025-09-28",
      "hide_collections": false,
      "emojis": [],
      "fields": [
        {
          "name": "Pinterest",
          "value": "\u003Ca href=\"https://pin.it/4lzwbZv\" rel=\"nofollow noopener\" translate=\"no\" target=\"_blank\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://\u003C/span\u003E\u003Cspan class=\"\"\u003Epin.it/4lzwbZv\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E\u003C/span\u003E\u003C/a\u003E",
          "verified_at": null
        },
        {
          "name": "Spotify",
          "value": "\u003Ca href=\"https://open.spotify.com/user/kuxmkc8vmn9xse9i8hgsdxsli?si=r9VSUaKJTfyhvZAv4q33fA\" rel=\"nofollow noopener\" translate=\"no\" target=\"_blank\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://\u003C/span\u003E\u003Cspan class=\"ellipsis\"\u003Eopen.spotify.com/user/kuxmkc8v\u003C/span\u003E\u003Cspan class=\"invisible\"\u003Emn9xse9i8hgsdxsli?si=r9VSUaKJTfyhvZAv4q33fA\u003C/span\u003E\u003C/a\u003E",
          "verified_at": null
        },
        {
          "name": "Instagram",
          "value": "\u003Ca href=\"https://instagram.com/olkaaakh?igshid=ZDdkNTZiNTM=\" rel=\"nofollow noopener\" translate=\"no\" target=\"_blank\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://\u003C/span\u003E\u003Cspan class=\"ellipsis\"\u003Einstagram.com/olkaaakh?igshid=\u003C/span\u003E\u003Cspan class=\"invisible\"\u003EZDdkNTZiNTM=\u003C/span\u003E\u003C/a\u003E",
          "verified_at": null
        }
      ]
    },
    "media_attachments": [],
    "mentions": [],
    "tags": [
      {
        "name": "Wordle",
        "url": "https://mastodon.social/tags/Wordle"
      },
      {
        "name": "wordlewarriors",
        "url": "https://mastodon.social/tags/wordlewarriors"
      }
    ],
    "emojis": [],
    "quote": null,
    "card": null,
    "poll": null,
    "quote_approval": {
      "automatic": [],
      "manual": [],
      "current_user": "denied"
    }
  },
  {
    "id": "115280709422846508",
    "created_at": "2025-09-28T07:20:24.000Z",
    "in_reply_to_id": null,
    "in_reply_to_account_id": null,
    "sensitive": true,
    "spoiler_text": "Инсайдер Киев\n\n\n[TRANSLATED MESSAGE]\nA completely destroyed street in Borschagivka\n\nInsider Kiev\n\n\nt.me/KyivPolitic/55376 ↩",
    "visibility": "public",
    "language": "en",
    "uri": "https://osintua.eu/users/uavideos/statuses/115280709195943602",
    "url": "https://osintua.eu/@uavideos/115280709195943602",
    "replies_count": 0,
    "reblogs_count": 0,
    "favourites_count": 0,
    "quotes_count": 0,
    "edited_at": null,
    "content": "\u003Cp\u003EVideo : \u003Ca href=\"https://videosua.osintukraine.com/media/2025-09-28/152713.MP4\" rel=\"nofollow noopener\" translate=\"no\" target=\"_blank\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://\u003C/span\u003E\u003Cspan class=\"ellipsis\"\u003Evideosua.osintukraine.com/medi\u003C/span\u003E\u003Cspan class=\"invisible\"\u003Ea/2025-09-28/152713.MP4\u003C/span\u003E\u003C/a\u003E \u003Cbr\u003EArchive : \u003Ca href=\"https://videosua.osintukraine.com/2025-09_10.html#152713\" rel=\"nofollow noopener\" translate=\"no\" target=\"_blank\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://\u003C/span\u003E\u003Cspan class=\"ellipsis\"\u003Evideosua.osintukraine.com/2025\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E-09_10.html#152713\u003C/span\u003E\u003C/a\u003E\u003C/p\u003E",
    "reblog": null,
    "account": {
      "id": "109471242875159954",
      "username": "uavideos",
      "acct": "uavideos@osintua.eu",
      "display_name": "Ukrainian Videos",
      "locked": false,
      "bot": true,
      "discoverable": true,
      "indexable": false,
      "group": false,
      "created_at": "2022-11-27T00:00:00.000Z",
      "note": "\u003Cp\u003EAutomated aggregation and translation of video posts text from Ukrainian Telegram channels covering the war in Ukraine. 🌻🇺🇦\u003C/p\u003E\u003Cp\u003EPart of \u003Cspan class=\"h-card\" translate=\"no\"\u003E\u003Ca href=\"https://0sint.social/@osintukraine\" class=\"u-url mention\" rel=\"nofollow noopener\" target=\"_blank\"\u003E@\u003Cspan\u003Eosintukraine\u003C/span\u003E\u003C/a\u003E\u003C/span\u003E\u003C/p\u003E\u003Cp\u003EMaintained by \u003Cspan class=\"h-card\" translate=\"no\"\u003E\u003Ca href=\"https://osintua.eu/@benb\" class=\"u-url mention\" rel=\"nofollow noopener\" target=\"_blank\"\u003E@\u003Cspan\u003Ebenb\u003C/span\u003E\u003C/a\u003E\u003C/span\u003E\u003C/p\u003E\u003Cp\u003Esearchable\u003C/p\u003E",
      "url": "https://osintua.eu/@uavideos",
      "uri": "https://osintua.eu/users/uavideos",
      "avatar": "https://files.mastodon.social/cache/accounts/avatars/109/471/242/875/159/954/original/d211d508c81a6b14.png",
      "avatar_static": "https://files.mastodon.social/cache/accounts/avatars/109/471/242/875/159/954/original/d211d508c81a6b14.png",
      "header": "https://files.mastodon.social/cache/accounts/headers/109/471/242/875/159/954/original/4f4b90e652b3f8e0.jpg",
      "header_static": "https://files.mastodon.social/cache/accounts/headers/109/471/242/875/159/954/original/4f4b90e652b3f8e0.jpg",
      "followers_count": 606,
      "following_count": 5,
      "statuses_count": 272778,
      "last_status_at": "2025-09-28",
      "hide_collections": false,
      "emojis": [],
      "fields": [
        {
          "name": "Video Telegram Archive",
          "value": "\u003Ca href=\"https://videosua.osintukraine.com\" rel=\"nofollow noopener\" translate=\"no\" target=\"_blank\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://\u003C/span\u003E\u003Cspan class=\"\"\u003Evideosua.osintukraine.com\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E\u003C/span\u003E\u003C/a\u003E",
          "verified_at": null
        },
        {
          "name": "Ukraine Telegram Archive",
          "value": "\u003Ca href=\"https://ukraine.osintukraine.com\" rel=\"nofollow noopener\" translate=\"no\" target=\"_blank\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://\u003C/span\u003E\u003Cspan class=\"\"\u003Eukraine.osintukraine.com\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E\u003C/span\u003E\u003C/a\u003E",
          "verified_at": null
        },
        {
          "name": "Video post only 2022",
          "value": "\u003Ca href=\"https://uavideos.osintukraine.com\" rel=\"nofollow noopener\" translate=\"no\" target=\"_blank\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://\u003C/span\u003E\u003Cspan class=\"\"\u003Euavideos.osintukraine.com\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E\u003C/span\u003E\u003C/a\u003E",
          "verified_at": null
        },
        {
          "name": "OSINTukraine Project",
          "value": "\u003Ca href=\"https://osintukraine.com\" rel=\"nofollow noopener\" translate=\"no\" target=\"_blank\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://\u003C/span\u003E\u003Cspan class=\"\"\u003Eosintukraine.com\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E\u003C/span\u003E\u003C/a\u003E",
          "verified_at": null
        }
      ]
    },
    "media_attachments": [],
    "mentions": [],
    "tags": [],
    "emojis": [],
    "quote": null,
    "card": null,
    "poll": null,
    "quote_approval": {
      "automatic": [],
      "manual": [],
      "current_user": "denied"
    }
  },
  {
    "id": "115280709330733299",
    "created_at": "2025-09-28T07:20:26.000Z",
    "in_reply_to_id": null,
    "in_reply_to_account_id": null,
    "sensitive": false,
    "spoiler_text": "",
    "visibility": "public",
    "language": "fr",
    "uri": "https://piaille.fr/users/GaelM/statuses/115280709295195087",
    "url": "https://piaille.fr/@GaelM/115280709295195087",
    "replies_count": 0,
    "reblogs_count": 0,
    "favourites_count": 0,
    "quotes_count": 0,
    "edited_at": null,
    "content": "\u003Cp\u003EOutre le fait que le PS continu de faire la cour a la bourgeoisie radicalisée, et que ce spectacle ne sert a rien, vu que le RN soutien (as usual) Le Cornu, et qu'une censure du 1er ministre par la gauche va servir a rien, on remarquera la présence de Marine Tondelier a la sauterie organisée par une lobbyiste de l'A69. (Et ça a fait des vagues chez Les Écologistes)\u003C/p\u003E\u003Cp\u003ELe PS laisse une ultime chance à Sébastien Lecornu de revoir sa copie\u003Cbr\u003E\u003Ca href=\"https://piaille.fr/tags/uniondesdroites\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003Euniondesdroites\u003C/span\u003E\u003C/a\u003E \u003Ca href=\"https://piaille.fr/tags/plusjamaisps\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003Eplusjamaisps\u003C/span\u003E\u003C/a\u003E \u003Ca href=\"https://piaille.fr/tags/a69\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003Ea69\u003C/span\u003E\u003C/a\u003E \u003Ca href=\"https://piaille.fr/tags/lagauchelaplusbetedumonde\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003Elagauchelaplusbetedumonde\u003C/span\u003E\u003C/a\u003E \u003Cbr\u003E\u003Ca href=\"https://www.lemonde.fr/politique/article/2025/09/28/le-ps-laisse-une-ultime-chance-a-sebastien-lecornu-de-revoir-sa-copie_6643226_823448.html\" rel=\"nofollow noopener\" translate=\"no\" target=\"_blank\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://www.\u003C/span\u003E\u003Cspan class=\"ellipsis\"\u003Elemonde.fr/politique/article/2\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E025/09/28/le-ps-laisse-une-ultime-chance-a-sebastien-lecornu-de-revoir-sa-copie_6643226_823448.html\u003C/span\u003E\u003C/a\u003E\u003C/p\u003E",
    "reblog": null,
    "account": {
      "id": "110644799452322212",
      "username": "GaelM",
      "acct": "GaelM@piaille.fr",
      "display_name": "Gaël M",
      "locked": false,
      "bot": false,
      "discoverable": true,
      "indexable": true,
      "group": false,
      "created_at": "2023-07-02T00:00:00.000Z",
      "note": "\u003Cp\u003E\u003Ca href=\"https://piaille.fr/tags/Actualit%C3%A9s\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003EActualités\u003C/span\u003E\u003C/a\u003E 📰 \u003Ca href=\"https://piaille.fr/tags/v%C3%A9lo\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003Evélo\u003C/span\u003E\u003C/a\u003E 🚲 \u003Ca href=\"https://piaille.fr/tags/Nature\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003ENature\u003C/span\u003E\u003C/a\u003E 🏞️ \u003Ca href=\"https://piaille.fr/tags/Biodiversit%C3%A9\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003EBiodiversité\u003C/span\u003E\u003C/a\u003E 🐼 \u003Ca href=\"https://piaille.fr/tags/Climat\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003EClimat\u003C/span\u003E\u003C/a\u003E 🌊 \u003Ca href=\"https://piaille.fr/tags/chats\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003Echats\u003C/span\u003E\u003C/a\u003E 🐱 \u003Ca href=\"https://piaille.fr/tags/vege\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003Evege\u003C/span\u003E\u003C/a\u003E🌱 \u003Ca href=\"https://piaille.fr/tags/ornithologie\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003Eornithologie\u003C/span\u003E\u003C/a\u003E 🐦 \u003Ca href=\"https://piaille.fr/tags/cinema\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003Ecinema\u003C/span\u003E\u003C/a\u003E🎬 \u003Ca href=\"https://piaille.fr/tags/s%C3%A9riestv\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003Esériestv\u003C/span\u003E\u003C/a\u003E \u003Ca href=\"https://piaille.fr/tags/tvshow\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003Etvshow\u003C/span\u003E\u003C/a\u003E 📺 \u003Ca href=\"https://piaille.fr/tags/popmusic\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003Epopmusic\u003C/span\u003E\u003C/a\u003E (électro, électro pop, rap, pop rock, rock alternatif etc etc.) 🎼 Veille sur les \u003Ca href=\"https://piaille.fr/tags/ExtremesDroites\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003EExtremesDroites\u003C/span\u003E\u003C/a\u003E 🏴. Bloque les climatosceptiques, l'alliance des droites, les robots et les adeptes de l'IA ⁂ ⏚🍉\u003Cbr\u003Esur ce compte : \u003Ca href=\"https://piaille.fr/tags/revuedepresse\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003Erevuedepresse\u003C/span\u003E\u003C/a\u003E le matin \u003Ca href=\"https://piaille.fr/tags/playlistantifasciste\" class=\"mention hashtag\" rel=\"nofollow noopener\" target=\"_blank\"\u003E#\u003Cspan\u003Eplaylistantifasciste\u003C/span\u003E\u003C/a\u003E le soir (quand je suis pas crevé)\u003Cbr\u003EAux commandes du compte \u003Cspan class=\"h-card\" translate=\"no\"\u003E\u003Ca href=\"https://piaille.fr/@Cinematraque\" class=\"u-url mention\" rel=\"nofollow noopener\" target=\"_blank\"\u003E@\u003Cspan\u003ECinematraque\u003C/span\u003E\u003C/a\u003E\u003C/span\u003E\u003C/p\u003E",
      "url": "https://piaille.fr/@GaelM",
      "uri": "https://piaille.fr/users/GaelM",
      "avatar": "https://files.mastodon.social/cache/accounts/avatars/110/644/799/452/322/212/original/e3308a39ea1ea566.png",
      "avatar_static": "https://files.mastodon.social/cache/accounts/avatars/110/644/799/452/322/212/original/e3308a39ea1ea566.png",
      "header": "https://files.mastodon.social/cache/accounts/headers/110/644/799/452/322/212/original/bfd576e40e8b0eeb.png",
      "header_static": "https://files.mastodon.social/cache/accounts/headers/110/644/799/452/322/212/original/bfd576e40e8b0eeb.png",
      "followers_count": 730,
      "following_count": 865,
      "statuses_count": 505,
      "last_status_at": "2025-09-28",
      "hide_collections": false,
      "emojis": [],
      "fields": [
        {
          "name": "Deezer",
          "value": "\u003Ca href=\"https://www.deezer.com/fr/profile/2847233064\" rel=\"nofollow noopener\" translate=\"no\" target=\"_blank\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://www.\u003C/span\u003E\u003Cspan class=\"ellipsis\"\u003Edeezer.com/fr/profile/28472330\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E64\u003C/span\u003E\u003C/a\u003E",
          "verified_at": null
        }
      ]
    },
    "media_attachments": [],
    "mentions": [],
    "tags": [
      {
        "name": "uniondesdroites",
        "url": "https://mastodon.social/tags/uniondesdroites"
      },
      {
        "name": "plusjamaisps",
        "url": "https://mastodon.social/tags/plusjamaisps"
      },
      {
        "name": "a69",
        "url": "https://mastodon.social/tags/a69"
      },
      {
        "name": "lagauchelaplusbetedumonde",
        "url": "https://mastodon.social/tags/lagauchelaplusbetedumonde"
      }
    ],
    "emojis": [],
    "quote": null,
    "card": null,
    "poll": null,
    "quote_approval": {
      "automatic": [],
      "manual": [],
      "current_user": "denied"
    }
  },
  {
    "id": "115280709315041652",
    "created_at": "2025-09-28T07:20:26.414Z",
    "in_reply_to_id": null,
    "in_reply_to_account_id": null,
    "sensitive": false,
    "spoiler_text": "",
    "visibility": "public",
    "language": "es",
    "uri": "https://mastodon.social/users/raqmar13/statuses/115280709315041652",
    "url": "https://mastodon.social/@raqmar13/115280709315041652",
    "replies_count": 0,
    "reblogs_count": 0,
    "favourites_count": 0,
    "quotes_count": 0,
    "edited_at": null,
    "content": "\u003Cp\u003ETe quiero como la águila al tiburón\u003C/p\u003E",
    "reblog": null,
    "application": {
      "name": "CheapBotsTootSweet",
      "website": null
    },
    "account": {
      "id": "112417710748028099",
      "username": "raqmar13",
      "acct": "raqmar13",
      "display_name": "🧡 animalitos queriéndose 🧡",
      "locked": false,
      "bot": true,
      "discoverable": true,
      "indexable": true,
      "group": false,
      "created_at": "2024-05-10T00:00:00.000Z",
      "note": "\u003Cp\u003EEste es un bot para que quieras como varios animales se quieren entre ellos.\u003C/p\u003E",
      "url": "https://mastodon.social/@raqmar13",
      "uri": "https://mastodon.social/users/raqmar13",
      "avatar": "https://files.mastodon.social/accounts/avatars/112/417/710/748/028/099/original/9e909302f0c4d9b4.jpg",
      "avatar_static": "https://files.mastodon.social/accounts/avatars/112/417/710/748/028/099/original/9e909302f0c4d9b4.jpg",
      "header": "https://files.mastodon.social/accounts/headers/112/417/710/748/028/099/original/ba2c182a2f14646e.jpg",
      "header_static": "https://files.mastodon.social/accounts/headers/112/417/710/748/028/099/original/ba2c182a2f14646e.jpg",
      "followers_count": 15,
      "following_count": 4,
      "statuses_count": 11071,
      "last_status_at": "2025-09-28",
      "hide_collections": null,
      "noindex": false,
      "emojis": [],
      "roles": [],
      "fields": []
    },
    "media_attachments": [],
    "mentions": [],
    "tags": [],
    "emojis": [],
    "quote": null,
    "card": null,
    "poll": null,
    "quote_approval": {
      "automatic": [
        "public"
      ],
      "manual": [],
      "current_user": "denied"
    }
  },
  {
    "id": "115280709294144157",
    "created_at": "2025-09-28T07:20:26.092Z",
    "in_reply_to_id": null,
    "in_reply_to_account_id": null,
    "sensitive": false,
    "spoiler_text": "",
    "visibility": "public",
    "language": "en",
    "uri": "https://mastodon.social/users/randostartrek/statuses/115280709294144157",
    "url": "https://mastodon.social/@randostartrek/115280709294144157",
    "replies_count": 0,
    "reblogs_count": 0,
    "favourites_count": 0,
    "quotes_count": 0,
    "edited_at": null,
    "content": "\u003Cp\u003ETonight on Enterprise\u003Cbr /\u003E Subcommander T&#39;Pol returns to Earth&#39;s past yet never really resolves the Klingon problem.\u003C/p\u003E",
    "reblog": null,
    "application": {
      "name": "CheapBotsTootSweet",
      "website": null
    },
    "account": {
      "id": "113610546535148218",
      "username": "randostartrek",
      "acct": "randostartrek",
      "display_name": "Rando Star Trek",
      "locked": false,
      "bot": true,
      "discoverable": true,
      "indexable": true,
      "group": false,
      "created_at": "2024-12-07T00:00:00.000Z",
      "note": "\u003Cp\u003EA random synopsis of a star trek episode without any AI slop by \u003Cspan class=\"h-card\" translate=\"no\"\u003E\u003Ca href=\"https://mastodon.social/@MrNuclearMonster\" class=\"u-url mention\"\u003E@\u003Cspan\u003EMrNuclearMonster\u003C/span\u003E\u003C/a\u003E\u003C/span\u003E\u003C/p\u003E\u003Cp\u003E\u003Ca href=\"https://mrnuclear.monster\" target=\"_blank\" rel=\"nofollow noopener\" translate=\"no\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://\u003C/span\u003E\u003Cspan class=\"\"\u003Emrnuclear.monster\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E\u003C/span\u003E\u003C/a\u003E\u003C/p\u003E",
      "url": "https://mastodon.social/@randostartrek",
      "uri": "https://mastodon.social/users/randostartrek",
      "avatar": "https://files.mastodon.social/accounts/avatars/113/610/546/535/148/218/original/237cc88fdfd12a6a.jpg",
      "avatar_static": "https://files.mastodon.social/accounts/avatars/113/610/546/535/148/218/original/237cc88fdfd12a6a.jpg",
      "header": "https://mastodon.social/headers/original/missing.png",
      "header_static": "https://mastodon.social/headers/original/missing.png",
      "followers_count": 394,
      "following_count": 12,
      "statuses_count": 6919,
      "last_status_at": "2025-09-28",
      "hide_collections": false,
      "noindex": false,
      "emojis": [],
      "roles": [],
      "fields": []
    },
    "media_attachments": [],
    "mentions": [],
    "tags": [],
    "emojis": [],
    "quote": null,
    "card": null,
    "poll": null,
    "quote_approval": {
      "automatic": [
        "public"
      ],
      "manual": [],
      "current_user": "denied"
    }
  },
  {
    "id": "115280709293489069",
    "created_at": "2025-09-28T07:20:24.000Z",
    "in_reply_to_id": null,
    "in_reply_to_account_id": null,
    "sensitive": false,
    "spoiler_text": "",
    "visibility": "public",
    "language": "en",
    "uri": "https://mastodon.nz/users/venzann/statuses/115280709214437806",
    "url": "https://mastodon.nz/@venzann/115280709214437806",
    "replies_count": 0,
    "reblogs_count": 0,
    "favourites_count": 0,
    "quotes_count": 0,
    "edited_at": null,
    "content": "\u003Cp\u003EIt's apparently 8:20pm due to today kicking over to daylight savings time.\u003Cbr\u003EI know it's technically meant to feel earlier, but it doesn't.\u003Cbr\u003ESeriously considering heading for bed.\u003C/p\u003E",
    "reblog": null,
    "account": {
      "id": "109286704043818734",
      "username": "venzann",
      "acct": "venzann@mastodon.nz",
      "display_name": "Dave Dustin",
      "locked": false,
      "bot": false,
      "discoverable": false,
      "indexable": false,
      "group": false,
      "created_at": "2022-11-02T00:00:00.000Z",
      "note": "\u003Cp\u003EPrincipal Data Reliability Engineer.\u003Cbr\u003EBased in Palmerston North, NZ.\u003C/p\u003E",
      "url": "https://mastodon.nz/@venzann",
      "uri": "https://mastodon.nz/users/venzann",
      "avatar": "https://files.mastodon.social/cache/accounts/avatars/109/286/704/043/818/734/original/17b7db75431c3fef.jpg",
      "avatar_static": "https://files.mastodon.social/cache/accounts/avatars/109/286/704/043/818/734/original/17b7db75431c3fef.jpg",
      "header": "https://files.mastodon.social/cache/accounts/headers/109/286/704/043/818/734/original/1dd8572e7013bd32.jpg",
      "header_static": "https://files.mastodon.social/cache/accounts/headers/109/286/704/043/818/734/original/1dd8572e7013bd32.jpg",
      "followers_count": 314,
      "following_count": 101,
      "statuses_count": 1957,
      "last_status_at": "2025-09-28",
      "hide_collections": false,
      "emojis": [],
      "fields": []
    },
    "media_attachments": [],
    "mentions": [],
    "tags": [],
    "emojis": [],
    "quote": null,
    "card": null,
    "poll": null,
    "quote_approval": {
      "automatic": [],
      "manual": [],
      "current_user": "denied"
    }
  },
  {
    "id": "115280709283929067",
    "created_at": "2025-09-28T07:20:22.000Z",
    "in_reply_to_id": "115274118621278226",
    "in_reply_to_account_id": "353979",
    "sensitive": false,
    "spoiler_text": "",
    "visibility": "public",
    "language": "de",
    "uri": "https://treehouse.technopagans.de/users/Magic_Cauldron/statuses/115280709041692223",
    "url": "https://treehouse.technopagans.de/@Magic_Cauldron/115280709041692223",
    "replies_count": 0,
    "reblogs_count": 0,
    "favourites_count": 0,
    "quotes_count": 0,
    "edited_at": null,
    "content": "\u003Cp\u003EZwischenstand: Bin vom Stroke Unit runter und kein Verdachtsfall mehr. Bleibe aber übers Wochenende im KH und werde dann Montag als Notfall zur Vorstellung in eine (andere als die bisherige) Augenklinik gekarrt.\u003C/p\u003E",
    "reblog": null,
    "account": {
      "id": "353979",
      "username": "Magic_Cauldron",
      "acct": "Magic_Cauldron@treehouse.technopagans.de",
      "display_name": "Magic Cauldron",
      "locked": false,
      "bot": false,
      "discoverable": true,
      "indexable": false,
      "group": false,
      "created_at": "2018-05-08T00:00:00.000Z",
      "note": "\u003Cp\u003EMagische Kesselguckerin, Autorin, Journalistin, Texterin, (Food-)Historikerin, Foodbloggerin, Feministin, Wollflüsterin, Kunsthandwerkerin. Netzaktivistin. Wahlberlinerin. Antifa.  BiPoC (white passing). Spoonie. Polyam. Sie/she.\u003Cbr\u003EZimt ist Liebe. 💙❤️🖤\u003C/p\u003E\u003Cp\u003ETitelbild: Metallschüssel, gefüllt mit Gartenkräutern und ein paar Walderdbeeren, einem Messer. Umkränzt von Erde, einer zerbrochenen Tasse, Steinchen, großen, grünen Farnblättern und Knoblauchsrauke.\u003C/p\u003E",
      "url": "https://treehouse.technopagans.de/@Magic_Cauldron",
      "uri": "https://treehouse.technopagans.de/users/Magic_Cauldron",
      "avatar": "https://files.mastodon.social/cache/accounts/avatars/000/353/979/original/f00fc25072a8aeeb.jpg",
      "avatar_static": "https://files.mastodon.social/cache/accounts/avatars/000/353/979/original/f00fc25072a8aeeb.jpg",
      "header": "https://files.mastodon.social/cache/accounts/headers/000/353/979/original/44a811974b2b1f1c.jpg",
      "header_static": "https://files.mastodon.social/cache/accounts/headers/000/353/979/original/44a811974b2b1f1c.jpg",
      "followers_count": 796,
      "following_count": 443,
      "statuses_count": 9359,
      "last_status_at": "2025-09-28",
      "hide_collections": false,
      "emojis": [],
      "fields": [
        {
          "name": "Foodblog \"Der magische Kessel\"",
          "value": "\u003Ca href=\"https://www.magischer-kessel.de/links/\" rel=\"nofollow noopener\" translate=\"no\" target=\"_blank\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://www.\u003C/span\u003E\u003Cspan class=\"\"\u003Emagischer-kessel.de/links/\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E\u003C/span\u003E\u003C/a\u003E",
          "verified_at": null
        },
        {
          "name": "Youtube-Channel",
          "value": "\u003Ca href=\"https://www.youtube.com/@Theophanus-Cauldron\" rel=\"nofollow noopener\" translate=\"no\" target=\"_blank\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://www.\u003C/span\u003E\u003Cspan class=\"ellipsis\"\u003Eyoutube.com/@Theophanus-Cauldr\u003C/span\u003E\u003Cspan class=\"invisible\"\u003Eon\u003C/span\u003E\u003C/a\u003E",
          "verified_at": null
        },
        {
          "name": "tip jar",
          "value": "\u003Ca href=\"https://ko-fi.com/magic_cauldron\" rel=\"nofollow noopener\" translate=\"no\" target=\"_blank\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://\u003C/span\u003E\u003Cspan class=\"\"\u003Eko-fi.com/magic_cauldron\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E\u003C/span\u003E\u003C/a\u003E",
          "verified_at": null
        },
        {
          "name": "Mein Kochbuch (Amazon)",
          "value": "\u003Ca href=\"https://www.amazon.de/33-s%C3%BC%C3%9Fe-Rezepte-aus-Vorratskammer/dp/375260610X/\" rel=\"nofollow noopener\" translate=\"no\" target=\"_blank\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://www.\u003C/span\u003E\u003Cspan class=\"ellipsis\"\u003Eamazon.de/33-s%C3%BC%C3%9Fe-Re\u003C/span\u003E\u003Cspan class=\"invisible\"\u003Ezepte-aus-Vorratskammer/dp/375260610X/\u003C/span\u003E\u003C/a\u003E",
          "verified_at": null
        }
      ]
    },
    "media_attachments": [],
    "mentions": [],
    "tags": [],
    "emojis": [],
    "quote": null,
    "card": null,
    "poll": null,
    "quote_approval": {
      "automatic": [],
      "manual": [],
      "current_user": "denied"
    }
  },
  {
    "id": "115280709282083933",
    "created_at": "2025-09-28T07:20:24.000Z",
    "in_reply_to_id": null,
    "in_reply_to_account_id": null,
    "sensitive": false,
    "spoiler_text": "",
    "visibility": "public",
    "language": "es",
    "uri": "https://masto.es/users/ramirenko/statuses/115280709190485459",
    "url": "https://masto.es/@ramirenko/115280709190485459",
    "replies_count": 0,
    "reblogs_count": 0,
    "favourites_count": 0,
    "quotes_count": 0,
    "edited_at": null,
    "content": "\u003Cp\u003EMirando cómo quedó el júrgol para que hoy durante la comida mi familia no piense que consumo drogas intravenosas.\u003C/p\u003E",
    "reblog": null,
    "account": {
      "id": "110793392333357969",
      "username": "ramirenko",
      "acct": "ramirenko@masto.es",
      "display_name": "Ramirenko",
      "locked": false,
      "bot": false,
      "discoverable": true,
      "indexable": true,
      "group": false,
      "created_at": "2023-07-28T00:00:00.000Z",
      "note": "\u003Cp\u003ELamentos de un cuarentón perdido en el torbellino tardocapitalista. Humor bajonero. Algo de música, libros y pelis. Lugar seguro para personas trans. Suelo hacer humor con cosas que me dan miedo, pero mi intención no es banalizar nada ni provocar, al contrario.\u003C/p\u003E\u003Cp\u003EDescripción del avatar: un dibujo de mi cara, de lineas simples. Llevo gafas de sol tipo Wayfarer, pelo castaño oscuro rizado y estoy muy serio.\u003C/p\u003E\u003Cp\u003EDescripción de la cabecera: foto de la marquesina de un cine abandonado.\u003C/p\u003E",
      "url": "https://masto.es/@ramirenko",
      "uri": "https://masto.es/users/ramirenko",
      "avatar": "https://files.mastodon.social/cache/accounts/avatars/110/793/392/333/357/969/original/4efa3f44e5337a79.jpg",
      "avatar_static": "https://files.mastodon.social/cache/accounts/avatars/110/793/392/333/357/969/original/4efa3f44e5337a79.jpg",
      "header": "https://files.mastodon.social/cache/accounts/headers/110/793/392/333/357/969/original/e31191c73b14fc8e.jpeg",
      "header_static": "https://files.mastodon.social/cache/accounts/headers/110/793/392/333/357/969/original/e31191c73b14fc8e.jpeg",
      "followers_count": 1008,
      "following_count": 365,
      "statuses_count": 7700,
      "last_status_at": "2025-09-28",
      "hide_collections": false,
      "emojis": [],
      "fields": [
        {
          "name": "Pronombres",
          "value": "Él, pero no me importa si usas otro",
          "verified_at": null
        },
        {
          "name": "LETTERBOXD",
          "value": "\u003Ca href=\"https://letterboxd.com/Ramirenko/\" rel=\"nofollow noopener\" translate=\"no\" target=\"_blank\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://\u003C/span\u003E\u003Cspan class=\"\"\u003Eletterboxd.com/Ramirenko/\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E\u003C/span\u003E\u003C/a\u003E",
          "verified_at": null
        },
        {
          "name": "GOODREADS",
          "value": "\u003Ca href=\"https://www.goodreads.com/user/show/132028422-ramirenko\" rel=\"nofollow noopener\" translate=\"no\" target=\"_blank\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://www.\u003C/span\u003E\u003Cspan class=\"ellipsis\"\u003Egoodreads.com/user/show/132028\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E422-ramirenko\u003C/span\u003E\u003C/a\u003E",
          "verified_at": null
        }
      ]
    },
    "media_attachments": [],
    "mentions": [],
    "tags": [],
    "emojis": [],
    "quote": null,
    "card": null,
    "poll": null,
    "quote_approval": {
      "automatic": [],
      "manual": [],
      "current_user": "denied"
    }
  },
  {
    "id": "115280709247509393",
    "created_at": "2025-09-28T07:18:57.000Z",
    "in_reply_to_id": null,
    "in_reply_to_account_id": null,
    "sensitive": false,
    "spoiler_text": "",
    "visibility": "public",
    "language": "en",
    "uri": "https://sportsbots.xyz/users/BVB/statuses/1972199334830915862",
    "url": "https://twitter.com/BVB/status/1972199334830915862",
    "replies_count": 0,
    "reblogs_count": 0,
    "favourites_count": 0,
    "quotes_count": 0,
    "edited_at": null,
    "content": "\u003Cp\u003EHappy debut boy! 🥰\u003C/p\u003E",
    "reblog": null,
    "account": {
      "id": "111840105545865636",
      "username": "BVB",
      "acct": "BVB@sportsbots.xyz",
      "display_name": "Borussia Dortmund 🤖",
      "locked": false,
      "bot": true,
      "discoverable": true,
      "indexable": false,
      "group": false,
      "created_at": "2010-07-12T00:00:00.000Z",
      "note": "\u003Cp\u003EUnofficial bot that mirrors Borussia Dortmund’s Twitter feed.\u003C/p\u003E\u003Cp\u003EOffizieller Account von Borussia Dortmund || 🇬🇧🇺🇸 \u003Cspan class=\"h-card\"\u003E\u003Ca href=\"https://twitter.com/BlackYellow\" class=\"u-url mention\" rel=\"nofollow noopener\" target=\"_blank\"\u003E@\u003Cspan\u003EBlackYellow@twitter.com\u003C/span\u003E\u003C/a\u003E\u003C/span\u003E || 🇯🇵 \u003Cspan class=\"h-card\"\u003E\u003Ca href=\"https://twitter.com/BVBjpn\" class=\"u-url mention\" rel=\"nofollow noopener\" target=\"_blank\"\u003E@\u003Cspan\u003EBVBjpn@twitter.com\u003C/span\u003E\u003C/a\u003E\u003C/span\u003E Impressum: \u003Ca href=\"http://bvb.de/Impressum\" rel=\"nofollow noopener\" target=\"_blank\"\u003E\u003Cspan class=\"invisible\"\u003Ehttp://\u003C/span\u003E\u003Cspan class=\"\"\u003Ebvb.de/Impressum\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E\u003C/span\u003E\u003C/a\u003E || Datenschutz: \u003Ca href=\"http://bvb.de/dse_twitter\" rel=\"nofollow noopener\" target=\"_blank\"\u003E\u003Cspan class=\"invisible\"\u003Ehttp://\u003C/span\u003E\u003Cspan class=\"\"\u003Ebvb.de/dse_twitter\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E\u003C/span\u003E\u003C/a\u003E\u003C/p\u003E",
      "url": "https://sportsbots.xyz/users/BVB",
      "uri": "https://sportsbots.xyz/users/BVB",
      "avatar": "https://files.mastodon.social/cache/accounts/avatars/111/840/105/545/865/636/original/197e87b663cb43d6.jpg",
      "avatar_static": "https://files.mastodon.social/cache/accounts/avatars/111/840/105/545/865/636/original/197e87b663cb43d6.jpg",
      "header": "https://mastodon.social/headers/original/missing.png",
      "header_static": "https://mastodon.social/headers/original/missing.png",
      "followers_count": 4380003,
      "following_count": 400,
      "statuses_count": 5541,
      "last_status_at": "2025-09-28",
      "hide_collections": false,
      "emojis": [],
      "fields": [
        {
          "name": "Twitter",
          "value": "\u003Ca href=\"https://twitter.com/BVB\" rel=\"nofollow noopener\" target=\"_blank\"\u003E\u003Cspan class=\"invisible\"\u003Ehttps://\u003C/span\u003E\u003Cspan class=\"\"\u003Etwitter.com/BVB\u003C/span\u003E\u003C/a\u003E",
          "verified_at": null
        },
        {
          "name": "Website",
          "value": "\u003Ca href=\"http://www.bvb.de\" rel=\"nofollow noopener\" target=\"_blank\"\u003E\u003Cspan class=\"invisible\"\u003Ehttp://\u003C/span\u003E\u003Cspan class=\"\"\u003Ebvb.de\u003C/span\u003E\u003Cspan class=\"invisible\"\u003E\u003C/span\u003E\u003C/a\u003E",
          "verified_at": null
        },
        {
          "name": "Managed by",
          "value": "\u003Cspan class=\"h-card\"\u003E\u003Ca href=\"https://mastodon.social/@sportsbots\" class=\"u-url mention\" rel=\"nofollow noopener\" target=\"_blank\"\u003E@\u003Cspan\u003Esportsbots\u003C/span\u003E\u003C/a\u003E\u003C/span\u003E",
          "verified_at": null
        },
        {
          "name": "Retention",
          "value": "\u003Cspan class=\"h-card\"\u003E90 days\u003C/span\u003E",
          "verified_at": null
        }
      ]
    },
    "media_attachments": [
      {
        "id": "115280709040131582",
        "type": "video",
        "url": "https://files.mastodon.social/cache/media_attachments/files/115/280/709/040/131/582/original/4bbd8a9da07fce07.mp4",
        "preview_url": "https://files.mastodon.social/cache/media_attachments/files/115/280/709/040/131/582/small/4bbd8a9da07fce07.png",
        "remote_url": "https://video.twimg.com/amplify_video/1972199091632230400/vid/avc1/1080x1920/x4z-D1e0Rn8JERTN.mp4?tag=21",
        "preview_remote_url": null,
        "text_url": null,
        "meta": {
          "original": {
            "width": 1080,
            "height": 1920,
            "frame_rate": "25/1",
            "duration": 21.653333,
            "bitrate": 4152818
          },
          "small": {
            "width": 360,
            "height": 640,
            "size": "360x640",
            "aspect": 0.5625
          }
        },
        "description": null,
        "blurhash": "UoI=A0xvxuWA^jozkAax8^M{NFs:s$M|agt7"
      }
    ],
    "mentions": [],
    "tags": [],
    "emojis": [],
    "quote": null,
    "card": null,
    "poll": null,
    "quote_approval": {
      "automatic": [],
      "manual": [],
      "current_user": "denied"
    }
  }
]

// --- HELPER FUNCTION: Formats date to a relative time string ---
const formatDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// --- SUB-COMPONENTS for the Blogs Page ---


// A UI element for creating a new post
const CreatePost = () => {

  const [statusText, setStatusText] = useState('')
  const addTimeline = useUserStore(state=>state.addTimeline)

  const handlePostStatus = async () => {
    // Call our proxy to post the status.
    // Construct an absolute URL to prevent parsing errors.
    if(statusText === '') return;
    
    const res = await fetch(`${window.location.origin}/api/mastodon/v1/statuses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusText }),
    });
    if (!res.ok) {
        throw new Error('API returned an error');
    }
    // Refresh timeline with the new post by prepending it.
    const newStatus = await res.json();
    console.log('new ', newStatus);
    
    addTimeline(newStatus);
    setStatusText('')
  };
  
  return (
    <div className="p-4 border-b border-neutral-800">
        <div className="flex items-start gap-4">
            <img src="https://placehold.co/48x48/111111/FFFFFF?text=A" alt="Your Avatar" className="w-12 h-12 rounded-full" />
            <div className="w-full">
                <textarea 
                    className="w-full bg-transparent text-xl text-gray-200 placeholder-neutral-500 focus:outline-none resize-none" 
                    rows="2" 
                    placeholder="What's on your mind?"
                    value={statusText}
                    onChange={(e) => {
                      setStatusText(e.target.value)
                    }}
                ></textarea>
                <div className="flex justify-end items-center mt-2 border-t border-neutral-800 pt-3">
                    <button onClick={handlePostStatus} className="px-5 py-2 text-md font-semibold bg-white text-black rounded-full transition-colors duration-200 hover:bg-neutral-200">
                        Post
                    </button>
                </div>
            </div>
        </div>
    </div>
)};

// A card to display a single post

const PostCard = ({ post, index }) => {
    // --- Determine Post Type based on index ---
    const isLive = index % 2 === 0;
    const isClip = index % 2 !== 0;

    // --- CSS ANIMATIONS & STYLES ---
    // In a real app, this would be in a CSS file. We embed it here for a single-file component.
    const styles = `
        /* --- Live Post Animations --- */
        @keyframes pulse-red {
            0% { box-shadow: 0 0 0 0 rgba(254, 105, 105, 0.7); }
            70% { box-shadow: 0 0 0 8px rgba(254, 105, 105, 0); }
            100% { box-shadow: 0 0 0 0 rgba(254, 105, 105, 0); }
        }
        .live-dot {
            animation: pulse-red 2s infinite;
        }

        @keyframes pulse-border {
            0% { box-shadow: 0 0 0 0px rgba(220, 38, 38, 0.4); } /* red-600 */
            100% { box-shadow: 0 0 0 4px rgba(220, 38, 38, 0); }
        }
        .live-post-glow {
            animation: pulse-border 1.5s infinite;
            border-color: #ef4444; /* red-500 */
        }

        /* --- Live Button Particle/Ripple Effect --- */
        @keyframes button-ripple {
            from { opacity: 0.6; transform: translate(-50%, -50%) scale(0); }
            to { opacity: 0; transform: translate(-50%, -50%) scale(6); }
        }
        .live-watch-button::after {
            content: '';
            position: absolute;
            border-radius: 9999px;
            background-color: white;
            width: 100%;
            padding-bottom: 100%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
        .live-watch-button:active::after {
            animation: button-ripple 0.6s ease-out 1;
        }
        
        /* --- Clip Post Styles & Metallic Sheen Animation --- */
        @keyframes metallic-sheen {
            0% { transform: translateX(-100%) skewX(-25deg); }
            100% { transform: translateX(250%) skewX(-25deg); }
        }
        .clip-card {
            position: relative;
            background-clip: padding-box;
            border: 1px solid #27272a; /* neutral-800 */
            overflow: hidden; /* Hide the sheen when it's outside */
        }
        .clip-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 40%;
            height: 100%;
            background: linear-gradient(
                to right, 
                transparent 0%, 
                rgba(192, 132, 252, 0.1) 50%, 
                transparent 100%
            );
            transform: translateX(-100%) skewX(-25deg);
            pointer-events: none; /* Let clicks pass through */
        }
        .clip-card:hover::before {
           animation: metallic-sheen 0.7s ease-in-out 1;
        }
    `;

    // --- SUB-COMPONENTS ---

    const ActionButton = ({ icon, count, hoverColor }) => (
        <button className={`flex items-center gap-2 text-neutral-400 hover:text-${hoverColor}-400 transition-colors duration-200 group`}>
            {icon}
            <span className={`text-sm group-hover:text-${hoverColor}-400`}>{count > 0 ? count : ''}</span>
        </button>
    );

    const LiveIndicator = () => (
        <div className="flex items-center gap-2 bg-neutral-800/50 px-2 py-1 rounded-md">
            <span className="relative flex h-2 w-2">
                <span className="live-dot absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-xs font-bold tracking-wider uppercase text-red-400">LIVE</span>
        </div>
    );
    
    const ClipIndicator = () => (
         <div className="flex items-center gap-2 bg-neutral-800/50 px-2 py-1 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" d="M3.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5m9 0a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5M10 3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z"/></svg>
            <span className="text-xs font-bold tracking-wider uppercase text-purple-400">CLIP</span>
        </div>
    );


    return (
        <>
            <style>{styles}</style>
            <article className={`p-4 border-b transition-all duration-300 ${isLive ? 'live-post-glow border-red-500' : 'clip-card hover:bg-neutral-800/40'}`}>
                <div className="flex items-start gap-4">
                    <img src={post.account?.avatar} alt={post.account?.display_name} className="w-12 h-12 rounded-full bg-neutral-700" />
                    <div className="w-full">
                        {/* Post Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                                <span className="font-bold text-gray-100">{post.account?.display_name}</span>
                                <span className="text-sm text-neutral-400 hidden sm:inline">@{post.account?.username}</span>
                                <span className="text-sm text-neutral-500">&middot; {formatDate(post.created_at)}</span>
                                {isLive && <LiveIndicator />}
                                {isClip && <ClipIndicator />}
                            </div>
                             <button className="text-neutral-500 hover:text-white flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m0-6c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m0 12c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2"/></svg>
                            </button>
                        </div>

                        {/* Post Content */}
                        <div 
                            className="prose prose-invert prose-sm text-gray-300 mt-2" 
                            dangerouslySetInnerHTML={{ __html: post.content }} 
                        />
                        
                        {/* Media Attachment */}
                        {post.media_attachments?.length > 0 && (
                            <div className="mt-3 rounded-2xl border border-neutral-700 overflow-hidden">
                                <img src={post.media_attachments[0].url} alt="Post media" className="w-full h-auto object-cover" />
                            </div>
                        )}
                        
                        {/* Conditional "Watch" Button */}
                        <div className="mt-4">
                            {isLive && (
                                <button className="live-watch-button relative w-full overflow-hidden flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-lg font-bold text-black transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7l-11-7Z"></path></svg>
                                    Watch Live
                                </button>
                            )}
                             {isClip && (
                                <button className="relative w-full overflow-hidden flex items-center justify-center gap-2 rounded-full bg-neutral-500/10 backdrop-blur-sm border border-neutral-500/30 px-6 py-2 text-md font-semibold text-white transition-colors duration-200 hover:bg-neutral-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-purple-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7l-11-7Z"></path></svg>
                                    Watch Clip
                                </button>
                            )}
                        </div>

                        {/* Action Bar */}
                        <div className="flex justify-between items-center mt-4 text-sm max-w-sm">
                            <ActionButton hoverColor="blue" count={post.replies_count} icon={<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M10 9V5l-7 7l7 7v-4.1c5 0 8.5 1.6 11 5.1c-1-5-4-10-11-11"/></svg>} />
                            <ActionButton hoverColor="green" count={post.reblogs_count} icon={<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M7 10h10v4l4-5l-4-5v4H7v2m10 4H7v-4l-4 5l4 5v-4h10v-2Z"/></svg>} />
                            <ActionButton hoverColor="red" count={post.favourites_count} icon={<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"/></svg>} />
                            <ActionButton hoverColor="blue" icon={<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81c1.66 0 3-1.34 3-3s-1.34-3-3-3s-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65c0 1.61 1.31 2.92 2.92 2.92c1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92"/></svg>} />
                        </div>
                    </div>
                </div>
            </article>
        </>
    );
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-4">
    <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div>
);

// --- The Main BlogsPage Component ---
const BlogsPage = () => {

  const user = useUserStore(state=>state.user)
  const isLoading = useUserStore(state=>state.isLoading)
  const timeline = useUserStore(state=>state.timeline)
  const lastPostId = useUserStore(state=>state.lastPostId)
  const isFetchingMore = useUserStore(state=>state.isFetchingMore)
  const appendTimeline = useUserStore(state=>state.appendTimeline)
  const setIsFetchingMore = useUserStore(state=>state.setIsFetchingMore)

  console.log('timeline',timeline);

  const observerRef = useRef(null);

  const fetchMorePosts = useCallback(async () => {
    // Prevent fetching if already in progress or if there's no more data to paginate from
    if (isFetchingMore || !lastPostId) return;

    setIsFetchingMore(true);
    try {
      // Use the lastPostId to paginate with the `max_id` parameter
      console.log(`/api/mastodon/v1/timelines/home?limit=20&max_id=${lastPostId}`);
      
      const res = await fetch(`${window.location.origin}/api/mastodon/v1/timelines/home?limit=20&max_id=${lastPostId}`);
      if (res.ok) {
        const newTimelineData = await res.json();
        // Append new data only if we received some
        if (newTimelineData.length > 0) {
          appendTimeline(newTimelineData);
        }
      } else {
        console.error("Failed to fetch more posts");
      }
    } catch (e) {
      console.error("Error fetching more posts:", e);
    } finally {
      setIsFetchingMore(false);
    }
  }, [lastPostId, isFetchingMore, appendTimeline, setIsFetchingMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // If the observer's target is intersecting (visible on screen)
        if (entries[0].isIntersecting) {
          fetchMorePosts();
        }
      },
      { threshold: 1.0 } // Trigger when the element is 100% visible
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    // Cleanup function to disconnect the observer
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [fetchMorePosts]);

  if (isLoading) {
    return (
        <div className='border-x border-neutral-800 min-h-screen'>
            <CreatePost />
            <LoadingSpinner/>
        </div>
    );
  }

  return (
    <div className='border-x border-neutral-800 min-h-screen'>
      <CreatePost />
      {timeline.map((post, i) => (
        // IMPORTANT: Use a stable, unique key like post.id
        <PostCard key={i} post={post} index={i}/>
      ))}

      {/* This invisible div is the trigger for the Intersection Observer */}
      <div ref={observerRef} style={{ height: "1px" }} />

      {/* Show loading spinner at the bottom while fetching more posts */}
      {isFetchingMore && <LoadingSpinner />}
      
      {/* Optional: Show a message when no more posts can be loaded */}
      {!isFetchingMore && timeline.length > 0 && !lastPostId && (
        <div className="text-center text-neutral-500 p-4">You've reached the end!</div>
      )}
    </div>
  );
}

export default BlogsPage;