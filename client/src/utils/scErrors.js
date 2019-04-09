/**
 *  Fix to more easily show errors from Steem Connect which are lacking in
 * the console logs. Courtesy of @ura-soul.
 */
(function(open) {
  XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
    if (url === 'https://steemconnect.com/api/broadcast') {
      this.addEventListener("readystatechange", function() {
        if (this.readyState === 4) {
          var reader = new FileReader();
          reader.addEventListener("loadend", function() {
            var result_codes = (JSON.parse(reader.result));
            if (result_codes.error_description)
              alert(result_codes.error_description);
          });
          reader.readAsBinaryString(this.response);
        }
      }, false);
    }
    open.call(this, method, url, async, user, pass);
  };
})(XMLHttpRequest.prototype.open);
