/**
 * Module: YT_YouTube.js
 * Gegenereerd tijdens de functionele herstructurering.
 */

function ytMaakUploadLijst(n = 4) {
  var uploadData = ytHaalMijnUploadsOp();
  function ytMaakHtmlElement(tg, str) {
    return "<" + tg + ">" + str + "</" + tg + ">";
  }
  function ytMaakHtmlLink(link, text) {
    return '<a href="' + link + '">' + text + '</a>';
  }
  var msg = "<ul>";
  for (var i in uploadData) {
    var s = uploadData[i];
    var title = s.title;
    var videoId = s.resourceId.videoId;
    var publishedAt = s.publishedAt;
    if (s.position < n) {
      msg += ytMaakHtmlElement("li", ytMaakHtmlLink("https://youtube.com/watch?v=" + videoId, title)) + "\n";
    }
  }
  msg += "</ul>";
  return msg;
}
function ytHaalMijnUploadsOp(rptSheet) {
  var uploadData = new Array();
  var results = YouTube.Channels.list('contentDetails', {
    id: 'UClt2GbA6n0zhT7E-uq7O4EA'
  });
  var results2 = YouTube.Channels.list('contentDetails', {
    mine: 'true'
  });
  ytLaad(rptSheet, 'contentDetails', results);
  function ytLaad(rptSheet, details, results) {
    if (rptSheet) rptSheet.appendRow([details, results]);
    for (var i in results.items) {
      var item = results.items[i];
      if (rptSheet) rptSheet.appendRow(['ytHaalMijnUploadsOp', item]);
      // Get the playlist ID, which is nested in contentDetails, as described in the
      // Channel resource: https://developers.google.com/youtube/v3/docs/channels

      var playlistId = 'PLoPwuTRfRbknunOLDue1P2Wa3EJEcFfTI';
      var nextPageToken = '';

      // This loop retrieves a set of playlist items and checks the nextPageToken in the
      // response to determine whether the list contains additional items. It repeats that process
      // until it has retrieved all of the items in the list.
      while (nextPageToken != null) {
        var playlistResponse = YouTube.PlaylistItems.list('snippet', {
          playlistId: playlistId,
          maxResults: 25,
          pageToken: nextPageToken
        });
        for (var j = 0; j < playlistResponse.items.length; j++) {
          var playlistItem = playlistResponse.items[j];
          if (rptSheet) rptSheet.appendRow(['snippet', playlistItem]);
          uploadData.push(playlistItem.snippet);
        }
        nextPageToken = playlistResponse.nextPageToken;
      }
    }
  }
  return uploadData;
}

/**
 * Creates a scheduled YouTube livestream.
 *
 * @param {string} title Stream title.
 * @param {string} date Date in yyyy-MM-dd format.
 * @param {string} time Time in HH:mm format (24h).
 * @return {Object} API response.
 */

function ytMaakYouTubeUitzending(title, date, time) {
  // Timezone of the script project
  const tz = Session.getScriptTimeZone();

  // Create RFC3339 timestamp
  const scheduled = Utilities.formatDate(new Date(date + "T" + time + ":00"), tz, "yyyy-MM-dd'T'HH:mm:ssXXX");
  const url = "https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet,status,contentDetails";
  const body = {
    snippet: {
      title: title,
      scheduledStartTime: scheduled
    },
    status: {
      privacyStatus: "public",
      selfDeclaredMadeForKids: false
    },
    contentDetails: {
      enableAutoStart: true,
      enableAutoStop: true
    }
  };
  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + ScriptApp.getOAuthToken()
    },
    payload: JSON.stringify(body),
    muteHttpExceptions: true
  };
  const response = UrlFetchApp.fetch(url, options);
  const result = JSON.parse(response.getContentText());
  Logger.log(result);
  return result;
}
function ytMaakLivestream(title) {
  const url = "https://www.googleapis.com/youtube/v3/liveStreams?part=snippet,cdn,status";
  const body = {
    snippet: {
      title: title
    },
    cdn: {
      ingestionType: "rtmp",
      resolution: "1080p",
      frameRate: "30fps"
    }
  };
  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + ScriptApp.getOAuthToken()
    },
    payload: JSON.stringify(body)
  };
  return JSON.parse(UrlFetchApp.fetch(url, options).getContentText());
}
function ytKoppelUitzending(broadcastId, streamId) {
  const url = "https://www.googleapis.com/youtube/v3/liveBroadcasts/bind" + "?id=" + encodeURIComponent(broadcastId) + "&part=id,contentDetails" + "&streamId=" + encodeURIComponent(streamId);
  const options = {
    method: "post",
    headers: {
      Authorization: "Bearer " + ScriptApp.getOAuthToken()
    }
  };
  return JSON.parse(UrlFetchApp.fetch(url, options).getContentText());
}

/**
 * This sample finds the active user's uploads, then updates the most recent
 * upload's description by appending a string.
 */
