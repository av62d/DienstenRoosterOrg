/**
 * Module: YT_YouTube.js
 * Gegenereerd tijdens de functionele herstructurering.
 */

function ytSendLastVideos() {
  var nr_videos = 16;
  var email = "<h4>Vorige " + nr_videos + " diensten</h4>" + ytYouTubeCreateUploadList(nr_videos);
  MailApp.sendEmail("avandervliet@pg-didam.nl", "Lijst met kerkdiensten", email);
  var x = 2;
}


function ytYouTubeCreateUploadList(n = 4) {
  var uploadData = ytYouTubeRetrieveMyUploads();

  function ytTag(tg, str) {
    return "<" + tg + ">" + str + "</" + tg + ">";
  }

  function ytTagLink(link, text) {
    return '<a href="' + link + '">' + text + '</a>';
  }
  var msg = "<ul>";
  for (var i in uploadData) {
    var s = uploadData[i];
    var title = s.title;
    var videoId = s.resourceId.videoId;
    var publishedAt = s.publishedAt;

    if (s.position < n) {
      msg += ytTag("li", ytTagLink("https://youtube.com/watch?v=" + videoId, title)) + "\n";
    }
  }
  msg += "</ul>";
  return msg;
}


function ytYouTubeRetrieveMyUploads(rptSheet) {

  var uploadData = new Array();
  var results = YouTube.Channels.list('contentDetails', { id: 'UClt2GbA6n0zhT7E-uq7O4EA' });
  //var results = YouTube.Channels.list('contentDetails', {forUsername: 'PKNDidam'});
  var results2 = YouTube.Channels.list('contentDetails', { mine: 'true' });



  ytLoad(rptSheet, 'contentDetails', results);
  // ytLoad(rptSheet, 'contentDetails2' , results2 ); 



  function ytLoad(rptSheet, details, results) {
    if (rptSheet) rptSheet.appendRow([details, results]);
    for (var i in results.items) {
      var item = results.items[i];
      if (rptSheet) rptSheet.appendRow(['ytYouTubeRetrieveMyUploads', item]);
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
          //  Logger.log('[%s] Title: %s', playlistItem.snippet.resourceId.videoId, playlistItem.snippet.title);
          if (rptSheet) rptSheet.appendRow(['snippet', playlistItem]);
          uploadData.push(playlistItem.snippet);

        }
        nextPageToken = playlistResponse.nextPageToken;
      }
    }
  }

  return (uploadData);
}


// function YouTubeCreateUploadsSheet(rptSheet = CreateOrClearSheet('Videos')) {


function ytYouTubeCreateUploadsSheet(rptSheet) {
  var uploadData = ytYouTubeRetrieveMyUploads();
  // Logger.log("Kind === "+ uploadData + "===");
  for (var i in uploadData) {
    var s = uploadData[i];
    if (1) rptSheet.appendRow([s]);

    var x1 = s.getChannelId();
    var x2 = s.getChannelTitle();
    var x3 = s.getDescription();
    var x4 = s.getPlaylistId();
    var x5 = s.getPosition();
    var d = new Date(s.getPublishedAt());


    var x9 = s.getTitle();

    if (1) {
      rptSheet.appendRow([
        s.getChannelId(),
        s.getChannelTitle(),
        s.getResourceId().getVideoId(),
        s.getDescription(),
        s.getPlaylistId(),
        s.getPosition(),
        s.getPublishedAt(),
        s.getTitle(),
        d
      ]);

    }
  }

  var x = 1;

}


/**
 * Creates a scheduled YouTube livestream.
 *
 * @param {string} title Stream title.
 * @param {string} date Date in yyyy-MM-dd format.
 * @param {string} time Time in HH:mm format (24h).
 * @return {Object} API response.
 */


function ytCreateYouTubeStream(title, date, time) {

  // Timezone of the script project
  const tz = Session.getScriptTimeZone();

  // Create RFC3339 timestamp
  const scheduled = Utilities.formatDate(
      new Date(date + "T" + time + ":00"),
      tz,
      "yyyy-MM-dd'T'HH:mm:ssXXX"
  );

  const url =
      "https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet,status,contentDetails";

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


function ytCreateLiveStream(title) {

  const url =
      "https://www.googleapis.com/youtube/v3/liveStreams?part=snippet,cdn,status";

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

  return JSON.parse(
      UrlFetchApp.fetch(url, options).getContentText()
  );
}


function ytBindBroadcast(broadcastId, streamId) {

  const url =
      "https://www.googleapis.com/youtube/v3/liveBroadcasts/bind" +
      "?id=" + encodeURIComponent(broadcastId) +
      "&part=id,contentDetails" +
      "&streamId=" + encodeURIComponent(streamId);

  const options = {
    method: "post",
    headers: {
      Authorization: "Bearer " + ScriptApp.getOAuthToken()
    }
  };

  return JSON.parse(
      UrlFetchApp.fetch(url, options).getContentText()
  );
}


/**
 * This sample finds the active user's uploads, then updates the most recent
 * upload's description by appending a string.
 */


function ytUpdateVideo() {
  // 1. Fetch all the channels owned by active user
  var myChannels = YouTube.Channels.list('contentDetails', {mine: true});
  // 2. Iterate through the channels and get the uploads playlist ID
  for (var i = 0; i < myChannels.items.length; i++) {
    var item = myChannels.items[i];
    var uploadsPlaylistId = item.contentDetails.relatedPlaylists.uploads;

    var playlistResponse = YouTube.PlaylistItems.list('snippet', {
      playlistId: uploadsPlaylistId,
      maxResults: 1
    });

    // Get the videoID of the first video in the list
    var video = playlistResponse.items[0];
    var originalDescription = video.snippet.description;
    var updatedDescription = originalDescription + ' Description updated via Google Apps Script';
    
    Logger.log('[%d] Title: %s -- %s',
               playlistResponse.items.length,
               video.snippet.title,
               video.snippet.description
              );
    video.snippet.description = updatedDescription;

    var resource = {
      snippet: {
        title: video.snippet.title,
        description: updatedDescription,
        categoryId: '22'
      },
      id: video.snippet.resourceId.videoId
    };
    Logger.log('[%s] Title: %s -- %s',
               video.snippet.resourceId.videoId,
               resource.snippet.title,
               resource.snippet.description
              );
    // YouTube.Videos.update(resource, 'id,snippet');
  }
}
