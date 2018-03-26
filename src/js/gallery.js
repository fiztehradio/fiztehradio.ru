var swap = function (elem1, elem2) {
  var elem1parent = elem1.parentNode;
  var elem1sibling = elem1.nextSibling === elem2 ? elem1 : elem1.nextSibling;
  elem2.parentNode.insertBefore(elem1, elem2);
  elem1parent.insertBefore(elem2, elem1sibling);
}

var getRandom = function(collection) {
  var randomIndex = Math.floor(Math.random() * collection.length)
  var randomElem = collection.get( randomIndex )
  return randomElem
}

var swapWithRandom = function (collection, elem) {
  var randomElem = getRandom(collection)

  // console.log('swap', elem, randomElem)
  swap(elem, randomElem)
}

var swapRandomElementsFrom = function (collectionFrom, collectionTo) {
  var randomElemFrom = getRandom(collectionFrom)
  var randomElemTo = getRandom(collectionTo)

  // console.log('swap', randomElemFrom, randomElemTo)
  swap(randomElemFrom, randomElemTo)
  // swapWithRandom(collectionTo, randomElem)
}

$(function () {
  var gallery = $('#gallery .container').find('.photo')
                  .not('.play-container').not('.text')

  gallery.each(function (index, elem) {
    swapWithRandom(gallery, elem)
  })

  $('#gallery .container').find('.photo.text').each(function (index, elem) {
    var middleLine = gallery.filter(':visible')
    swapWithRandom(middleLine, elem)
  })

  var ticker = setInterval(function () {
    swapRandomElementsFrom(gallery.filter(':hidden'), gallery.filter(':visible'))
  }, 300)

})
