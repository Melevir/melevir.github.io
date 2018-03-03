var localstorageKeyName = 'studentPackMaterialsStat',
  getCurrentStat = function() {
  var stat = localStorage.getItem(localstorageKeyName);
  if (stat == undefined) {
    return {}
  } else {
      return JSON.parse(stat);
  }
},
updateItemState = function(topic, subtopic, item, newState) {
  var stat = getCurrentStat();

  stat[topic] = stat[topic] || {};
  stat[topic][subtopic] = stat[topic][subtopic] || {};
  stat[topic][subtopic][item] = stat[topic][subtopic][item] || {};

  stat[topic][subtopic][item] = {state: newState};
  localStorage.setItem(localstorageKeyName, JSON.stringify(stat));
},
getItemStatus = function(stat, topic, subtopic, item) {
  stat[topic] = stat[topic] || {};
  stat[topic][subtopic] = stat[topic][subtopic] || {};
  stat[topic][subtopic][item] = stat[topic][subtopic][item] || {};

  var itemStat = stat[topic][subtopic][item];
  if (itemStat != undefined) {
      return itemStat.state;
  }
},
redrawMaterialItem = function($li, materialsStat) {
  var subtopicId = $li.closest('ul').data('subtopicId').toString(),
    topicId = $('.topic_content').data('topicId').toString(),
    itemId = $li.data('itemId').toString(),
    itemStatus = getItemStatus(materialsStat, topicId, subtopicId, itemId);
  if (itemStatus == 'got_it') {
      $li.addClass('success');
  } else if (itemStatus == 'visited') {
      $li.append('<span class="got_it_btn">✓ я понял</span>');
  }
},
updateMaterialsStatuses = function() {
  var materialLists = $('.topic_content').find('ul'),
    materialsStat = getCurrentStat(),
    itemId,
    $ul,
    $li,
    subtopicId;

  $.each(materialLists, function(index, ul) {
    $ul = $(ul);
    subtopicId = $ul.data('subtopicId');
    if(subtopicId != undefined) {
      $.each($ul.find('li'), function(index, li) {
        $li = $(li);
        itemId = $li.data('itemId').toString();
        redrawMaterialItem($li, materialsStat);
      });
    }
  });
};

$('.hider_btn').click(function(e) {
  var $target = $(e.target),
      content = $target.closest('.hider').find('.hider_content');
  $target.hide();
  content.fadeIn();
});

$('body').on('click', '.got_it_btn', function(e) {
   var $target = $(e.target),
     li = $target.closest('li'),
     itemId = li.data('itemId'),
     subtopicId = $target.closest('ul').data('subtopicId'),
     topicId = $('.topic_content').data('topicId');

   updateItemState(topicId, subtopicId, itemId, 'got_it');
   redrawMaterialItem($(li), getCurrentStat());
   $target.fadeOut();
});

$('.topic_content li>a').click(function(e) {
   var $target = $(e.target),
     li = $target.closest('li'),
     itemId = li.data('itemId'),
     subtopicId = $target.closest('ul').data('subtopicId'),
     topicId = $('.topic_content').data('topicId');

   updateItemState(topicId, subtopicId, itemId, 'visited');
   redrawMaterialItem($(li), getCurrentStat());
});

updateMaterialsStatuses();
