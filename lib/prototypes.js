setTimeout(() => {
  fileLoads.isPrototypesJS = true; //for file handling in fileTester.js
}, 10);

String.prototype.sanitize = function() {
  let input = this.valueOf(), regExp = /\n\s+/g
  //if (typeof(input) === "string") {
    str = input.replace(/[^\S\n]+/g, " ") //replace all non-newline whitespace characters with space characters
    str = str.replace(/\n\s+/g, "\n") //replace all instances of newlines followed by whitespace with single newlines
    let padding = (str.includes("  ") || regExp.test(str)) //check for resulting double-spaces
    while (padding) { //repeatedly replace double-spaces with single spaces until none remain
      str = str.replaceAll("  ", " ")
      str = str.replace(/\n\s+/g, "\n")
      padding = (str.includes("  ") || regExp.test(str))
    }
    return str.trim() //remove preceding and trailing whitespace
  /*} else {
    let received = typeof(input), vowels = "aAeEiIoOuU"
    throw new TypeError(`expecting a string but getting ${vowels.includes(received[0]) ? "an" : "a"} ${received}`)
  }
  
  //if-else was not needed, because using this function on a non-string variable immediately throws a TypeError,
  since this was a String prototype, instead of an Object prototype. So the customized TypeError was not being thrown, anyway.
  And it didn't make much sense to me making this into an Object prototype if it only accepted String objects, so I just
  decided to remove the custom error message throwing. I left it in the code as a comment in case someone less perfectionist
  than I decides to use it.
  		-R3d5t0n3_GUY
  */
}

String.prototype.escapeHTML = function() {
  let str = this.valueOf();
  return str.replace(/[&<>"']/g, function(tag) {
    let replacements = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return replacements[tag] || tag;
  });
}

Number.prototype.mapToScale = function(min1, max1, min2, max2) {
  let n = this.valueOf(), numer = max2 - min2, denomin = max1 - min1;
  return (numer / denomin) * (n - min1) + min2
}