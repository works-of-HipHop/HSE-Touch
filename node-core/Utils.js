/**
* Copyright (c) 2013 - 2015 @MaxVerified on behalf of 5ive Design Studio (Pty) Ltd. 
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* 
*/
define( function ( require, exports, module ) {

    "use strict";

     /**
     * @constructor
     * Creates a queue of async operations that will be executed sequentially. Operations can be added to the
     * queue at any time. If the queue is empty and nothing is currently executing when an operation is added, 
     * it will execute immediately. Otherwise, it will execute when the last operation currently in the queue 
     * has finished.
     */
    function Utils() {
    }

    Utils.prototype =  {

        /**
         * Equivelant to $(el).on( eventName, eventHandler );
         *
         * @param Object.el
         * @param String.eventName
         * @param Function.handler
         * 
         * @return null
         */
        addEventListener: function ( el, eventName, handler ) {

			//this._strict( [ Object, String, Function ], arguments );

			if( el.addEventListener ) {

                el.addEventListener( eventName, handler );
            
            } else {

                el.attachEvent( 'on' + eventName, function() {

                    handler.call(el);
                });

            }
        
        },

		removeEventListener: function (el, eventName, handler) {

			//this._strict( [ Object, String, Function ], arguments );
			
			if ( el.removeEventListener )
				el.removeEventListener(eventName, handler);
			else
				el.detachEvent( 'on' + eventName, handler );

		},

        hide: function ( el ) {

            this._strict( [ Object ], arguments );

            el.style.display = 'none';
        
        },

        show: function ( el ) {

            this._strict( [ Object ], arguments );

            el.style.display = '';
        
        },

		fadeIn: function ( el ) {

            var opacity = 0;

            el.style.opacity = 0;
            el.style.filter = '';

            var last = +new Date();
            var tick = function() {

                opacity += ( new Date() - last ) / 400;

                el.style.opacity = opacity;
                el.style.filter = 'alpha(opacity=' + (100 * opacity)|0 + ')';

                last = +new Date();

                if( opacity < 1 ) {

                    (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
                }
            }

            tick();
        
		},
        // Class Handlers
		hasClass: function ( elem, className ) {

			if( elem === null ) {
				return;
			}

			return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
		
		},

		addClass: function ( elem, className ) {

			if( elem === null || elem == undefined ) {
				return;
			}

			if (document.documentElement.classList) {

    			elem.classList.add(className);

    		} else {
			
				if ( !this.hasClass(elem, className) ) {
					elem.className += ' ' + className;
				}

			}

		},

		removeClass: function ( elem, className ) {

			if( elem === null || elem == undefined ) {
				return;
			}

    		if (document.documentElement.classList) {

    			elem.classList.remove(className);

    		} else {

				var _self 	 = this,
					newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';
				
				if ( _self.hasClass(elem, className)) {
					
					while ( newClass.indexOf(' ' + className + ' ') >= 0 ) {
						newClass = newClass.replace(' ' + className + ' ', ' ');
					}
					
					elem.className = newClass.replace(/^\s+|\s+$/g, '');
				}
			
			}

		},

		toggleClass: function ( elem, className ) {

			if( elem === null || elem == undefined ) {
				return;
			}

			if (document.documentElement.classList) {

    			elem.classList.toggle(className);

    		} else {

				var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ' ) + ' ';
				
				if ( this.hasClass(elem, className) ) {

					while (newClass.indexOf(' ' + className + ' ') >= 0 ) {

						newClass = newClass.replace( ' ' + className + ' ' , ' ' );
					}

					elem.className = newClass.replace(/^\s+|\s+$/g, '');

				} else {

					elem.className += ' ' + className;
				}

			}

		},

        // returns the closest element to 'e' that has class "classname"
        closest: function ( e, classname ) {
            if( this.hasClass( e, classname ) ) {
                return e;
            }
            return e.parentNode && this.closest( e.parentNode, classname );
        
        },

        getParents: function ( elem ) {

            if( elem === null ) {
                return;
            }

			var parents = [],
				p = el.parentNode;

			while ( p !== null ) {
				
				var o = p;
				
				parents.push(o);
				
				p = o.parentNode;
			}
            
            return parents; // returns an Array []

        },

        // taken from https://github.com/inuyaksa/jquery.nicescroll/blob/master/jquery.nicescroll.js
        hasParent: function ( e, id ) {
            if (!e) return false;
            var el = e.target||e.srcElement||e||false;
            while (el && el.id != id) {
                el = el.parentNode||false;
            }
            return (el!==false);
        
        },

        // returns the depth of the element "e" relative to element with id=id
        // for this calculation only parents with classname = waypoint are considered
        getLevelDepth: function ( e, id, waypoint, cnt ) {
            cnt = cnt || 0;
           
            if ( e.id.indexOf( id ) >= 0 ) return cnt;
           
            if( this.hasClass( e, waypoint ) ) {
                ++cnt;
            }

            return e.parentNode && this.getLevelDepth( e.parentNode, id, waypoint, cnt );
        },

		browserSupportsCSSProperty: function ( propertyName ) {
			
			var elm = document.createElement('div');
			propertyName = propertyName.toLowerCase();

			if ( elm.style[propertyName] != undefined )
				return true;

			var propertyNameCapital = propertyName.charAt(0).toUpperCase() + propertyName.substr(1),
				domPrefixes = 'Webkit Moz ms O'.split(' '),
				domPrefixesLength = domPrefixes.length;

			for ( var i = 0; i < domPrefixesLength; i++ ) {
				if (elm.style[domPrefixes[i] + propertyNameCapital] != undefined)
					return true;
			}
			
			return false;
		
		},

        // Underscore.js 1.4.3
        // http://underscorejs.org
        // (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
        // Underscore may be freely distributed under the MIT license.

        // _.throttle
        // https://github.com/documentcloud/underscore/blob/master/underscore.js#L626
        // Returns a function, that, when invoked, will only be triggered at most once
        // during a given window of time.

        throttle: function ( func, wait ) {

            this._strict( [ Function, Number ], arguments );

            var context, args, timeout, result;
            var previous = 0;
            var later = function() {
                    previous = new Date();
                    timeout = null;
                    result = func.apply(context, args);
            }
            
            return function() {
                
                var now = new Date();
                var remaining = wait - (now - previous);
                
                context = this;
                args = arguments;
                
                if ( remaining <= 0 ) {
                    
                    clearTimeout(timeout);
                    
                    timeout = null;
                    previous = now;
                    result = func.apply(context, args);

                } else if (!timeout) {
                    timeout = setTimeout(later, remaining);
                }

                return result;
            }
        
        },

        /**
         * Returns Boolean about date parameter
         *
         * @param String.date
         * 
         * @return Boolean
         */
        isDate: function ( date ) {

            //this._strict( [ String ], arguments );
            /** /
            var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
            
            switch( type ) {

                case 'year':

                    break;

                case 'month':

                    break;

                case 'day':

                    break;

                default:

                    return ( ( new Date(date) !== "Invalid Date" && !isNaN( new Date(date) ) ) );

                    break;
            }/**/
            return ( ( new Date(date) !== "Invalid Date" && !isNaN( new Date(date) ) ) );
        
        },

        // Source: http://stackoverflow.com/questions/497790
        convertDate: function( d ) {
            // Converts the date in d to a date-object. The input can be:
            //  a date object: returned without modification
            //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
            //  a number     : Interpreted as number of milliseconds since 1 Jan 1970 (a timestamp) 
            //  a string     : Any format supported by the javascript engine, like
            //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
            //  an object     : Interpreted as an object with year, month and date attributes.  **NOTE** month is 0-11.
            return (
                d.constructor === Date ? d :
                d.constructor === Array ? new Date(d[0],d[1],d[2]) :
                d.constructor === Number ? new Date(d) :
                d.constructor === String ? new Date(d) :
                typeof d === "object" ? new Date(d.year,d.month,d.date) :
                NaN
            );

        },

        compareDates: function( a, b ) {

            var that = this;
            // Compare two dates (could be of any type supported by the convert
            // function above) and returns:
            //  -1 : if a < b
            //   0 : if a = b
            //   1 : if a > b
            // NaN : if a or b is an illegal date
            // NOTE: The code inside isFinite does an assignment (=).
            return (
                    isFinite(a=that.convertDate(a).valueOf()) &&
                    isFinite(b=that.convertDate(b).valueOf()) ?
                    (a>b)-(a<b) :
                    NaN
            );
        
        },

        DatesInRange: function( d, start, end ) {
                // Checks if date in d is between dates in start and end.
                // Returns a boolean or NaN:
                //    true  : if d is between start and end (inclusive)
                //    false : if d is before start or after end
                //    NaN   : if one or more of the dates is illegal.
                // NOTE: The code inside isFinite does an assignment (=).
               return (
                    isFinite(d=this.convertDate(d).valueOf()) &&
                    isFinite(start=this.convertDate(start).valueOf()) &&
                    isFinite(end=this.convertDate(end).valueOf()) ?
                    start <= d && d <= end :
                    NaN
                );
        
        },

        time_diff: function (t1, t2) {

            var timeStart = new Date("01/01/2007 " + t1).getHours();
            var timeEnd = new Date("01/01/2007 " + t2).getHours();
             
            var hourDiff = timeEnd - timeStart;

            return hourDiff;
        
        },

        generateYears: function( startYear ) {

        	this._strict( [ Number ], arguments );

			var currentYear = new Date().getFullYear(), years = [];
				startYear = startYear || 1900;

			while ( startYear <= currentYear ) {
			
				years.push(startYear++);
			
			} 

        	return years;
		
		},

        date_by_subtracting_days: function(date, days) {

            this._strict( [ Date, Number ], arguments );

            return new Date(
                date.getFullYear(), 
                date.getMonth(), 
                date.getDate() - days,
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds()
            );
        
        },
    
        /**
         * Returns Boolean about email parameter
         *
         * @param String.emailAddress
         * 
         * @return Boolean
         */
        isEmail: function ( emailAddress ) {

            this._strict( [ String ], arguments );

            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

            return pattern.test( emailAddress );
        
        },

        /**
         * Returns a random integer between min and max
         *
         * @param String.str
         * 
         * @return String - 160 Char truncated with ...
         */
        initcap: function( str ) {

            this._strict( [ String ], arguments );
        
            return str.substring(0,1).toUpperCase() + str.substring(1);
        
        },

        /**
         * Test whether parameter is an integer
         *
         * @param Number.str
         * 
         * @return Boolean
         */
        testint: function( str ) {

            //this._strict( [ Number ], arguments );

            var intRegex = /^\d+$/;
            if(intRegex.test(str)) {
                return true;
            }
            return false;
        
        },

        testNumber: function( str ) {

            //this._strict( [ Number ], arguments );

            //var numberRegex  = /^-?\\d{1,9}(\\.\\d{1,6})?$/;
            var numberRegex = /^([+-](?=\.?\d))?(\d+)?(\.\d+)?$/;
            if(numberRegex.test(str)) {
                return true;
            }
            return false;
        
        },

        /**
         * Remove all whitespace
         *
         * @param String.str
         * 
         * @return String
         *
         * @note: Doesn't work with other types of whitespace though, 
         * for instance &#8239; (thin space) or &nbsp; (non-breaking space)
         */
        removeSpace: function ( str ) {

            return str.replace(/\s+/g, '');
        
        },

        /**
         * Remove leading and trailing whitespace
         *
         * @param String.str
         * 
         * @return String
         *
         * @note: Doesn't work with other types of whitespace though, 
         * for instance &#8239; (thin space) or &nbsp; (non-breaking space)
         */
        trim: function ( str ) {

            this._strict( [ String ], arguments );

            return str.replace( /(^\s+|\s+$)/g, '' );
        
        },

        /**
         * Check for Alpha Numeric Characters Only
         *
         * @param String.str
         * 
         * @return String | Boolean
         *
         */
        alphanumeric: function ( str ) {

            this._strict( [ String ], arguments );

            var regex = /^[a-z]+$/,
                _self = this;

            if( str.match(regex) ) {

                return _self.trim(str);

            } else {

                return false;
            }
        
        },

        /**
         * Returns a random integer between min and max
         *
         * @param Number min - lower bound
         * @param Number max - upper bound
         * @return Number - a random number between min and max
         */
        getRandomInt: function ( min, max ) {

            this._strict( [ Number, Number ], arguments );

            return Math.floor(Math.random() * (max - min + 1)) + min;
        
        },

        /**
		 * Returns file extension from file name
		 *
		 * @param String filename
		 * 
		 * @return String - file extension
		 * 
		 */
        _getFileExtension: function ( fileName ) {
            
            this._strict( [ String ], arguments );

            var i = fileName.lastIndexOf("."),
                ext = (i === -1 || i >= fileName.length - 1) ? fileName : fileName.substr(i + 1);

            return ext;
        
        },

        getFileName: function ( url ) {

            this._strict( [ String ], arguments );

            var anchor = url.indexOf('#');
            var query = url.indexOf('?');
            var end = Math.min( anchor > 0 ? anchor : url.length, query > 0 ? query : url.length );

            return url.substring( url.lastIndexOf('/', end) + 1, end );

        },

        /**
         * Returns the filename or guessed filename from the url (see issue 3455).
         * url {String} The original PDF location.
         * @return {String} Guessed PDF file name.
         */
        getPDFFileNameFromURL: function ( url ) {

            this._strict( [ String ], arguments );
          
            var reURI = /^(?:([^:]+:)?\/\/[^\/]+)?([^?#]*)(\?[^#]*)?(#.*)?$/;
            //            SCHEME      HOST         1.PATH  2.QUERY   3.REF
            // Pattern to get last matching NAME.pdf
            var reFilename = /[^\/?#=]+\.pdf\b(?!.*\.pdf\b)/i;
            var splitURI = reURI.exec(url);
            var suggestedFilename = reFilename.exec(splitURI[1]) ||
                                   reFilename.exec(splitURI[2]) ||
                                   reFilename.exec(splitURI[3]);
            
            if ( suggestedFilename ) {
                
                suggestedFilename = suggestedFilename[0];
                
                if ( suggestedFilename.indexOf('%') != -1 ) {
                    // URL-encoded %2Fpath%2Fto%2Ffile.pdf should be file.pdf
                    try {
                        suggestedFilename = reFilename.exec( decodeURIComponent(suggestedFilename) )[0];
                    } catch(e) { // Possible (extremely rare) errors:
                        // URIError "Malformed URI", e.g. for "%AA.pdf"
                        // TypeError "null has no properties", e.g. for "%2F.pdf"
                    }
                }
            }
            
            return suggestedFilename || 'document.pdf';

        },

        /**
		 * 
		 *
		 * @param Object.element
		 * @param Number.to
		 * @param Number.duration
		 * 
		 * @return Null
		 * 
		 */
        scrollTo: function ( element, to, duration ) {

        	//this._strict( [ HTMLBodyElement, Number, Number ], arguments );

            var _self       = this,
                difference  = to - element.scrollTop,
                perTick     = difference / duration * 10;

            if( duration < 0 ) {
                return;
            }

            setTimeout( function(){

                element.scrollTop = element.scrollTop + perTick;

                if( element.scrollTop == to ) {
                    return;
                }

                _self.scrollTo ( element, to, duration - 10 );
            
            }, 10 ) ;
        
        },

        /**
         * Scrolls specified element into view of its parent.
         * element {Object} The element to be visible.
         * spot {Object} The object with the top property -- offset from the top edge.
         */
        scrollIntoView: function ( element, spot ) {
            
            // Assuming offsetParent is available (it's not available when viewer is in
            // hidden iframe or object). We have to scroll: if the offsetParent is not set
            // producing the error. See also animationStartedClosure.
            var parent = element.offsetParent;
            var offsetY = element.offsetTop + element.clientTop;
            
            if ( !parent ) {
                console.error('offsetParent is not set -- cannot scroll');
                return;
            }
          
            while (parent.clientHeight == parent.scrollHeight) {
                
                offsetY += parent.offsetTop;
                parent = parent.offsetParent;
                
                if ( !parent )
                    return; // no need to scroll
            }

            if ( spot )
                offsetY += spot.top;
                parent.scrollTop = offsetY;
        
        },

        /**
         * Start an animation by adding the given class to the given target. When the
         * animation is complete, removes the class, clears the event handler we attach
         * to watch for the animation to finish, and resolves the returned promise.
         *
         * @param {Element} target The DOM node to animate.
         * @param {string} animClass The class that applies the animation/transition to the target.
         * @return {$.Promise} A promise that is resolved when the animation completes. Never rejected.
         *c/
        animateUsingClass: function ( target, animClass ) {
           
            var result = new $.Deferred();
            
            function finish(e) {
                if (e.target === target) {
                    $(target)
                        .removeClass(animClass)
                        .off("webkitTransitionEnd", finish);
                    result.resolve();
                }
            }
            
            // Note that we can't just use $.one() here because we only want to remove
            // the handler when we get the transition end event for the correct target (not
            // a child).
            $(target)
                .addClass(animClass)
                .on("webkitTransitionEnd", finish);
            
            return result.promise();

        },

        /**
         * Event handler to suppress context menu.
         */
        noContextMenuHandler: function (e) {
        
            e.preventDefault();
        
        },

        extend: function ( a, b ) {
            
            for( var key in b ) { 
                if( b.hasOwnProperty( key ) ) {
                    a[key] = b[key];
                }
            }

            return a;
        
        },

        // http://coveroverflow.com/a/11381730/989439
        mobilecheck: function () {
            var check = false;
            (function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
            return check;
        
        },

        // Helper function that chains a series of promise-returning
        // functions together via their done callbacks.
        chain: function () {

            //this._strict( [ Array, String ], arguments );

            var self = this,
                functions = Array.prototype.slice.call(arguments, 0);
            if (functions.length > 0) {
                var firstFunction = functions.shift();
                var firstPromise = firstFunction.call();

                firstPromise.done(function () {
                    chain.apply(null, functions);
                });
            }
        
        },

        /**
         * Returns the first index in 'array' for which isMatch() returns true, or -1 if none
         * 
         * @param {*} object The object to test
         * @return {boolean}
         */
        _isObjEmpty: function ( obj ) {

            //this._strict( [ Object ], arguments );

            // Speed up calls to hasOwnProperty
            var hasOwnProperty = Object.prototype.hasOwnProperty;

             // null and undefined are empty
            if ( obj == null ) return true;
            // Assume if it has a length property with a non-zero value that that property is correct.
            if ( obj.length && obj.length > 0 ) return false;
            if ( obj.length === 0 )  return true;

            for (var key in obj) {
                if (hasOwnProperty.call(obj, key))    return false;
            }

            // Doesn't handle toString and toValue enumeration bugs in IE < 9
            return true;
        
        },

        /**
         * Returns the first index in 'array' for which isMatch() returns true, or -1 if none
         * 
         * @param {!Array.<*>|jQueryObject} array
         * @param {!function(*, Number):boolean} isMatch Passed (item, index), same as with forEach()
         */
        _indexOf: function ( array, isMatch ) {
            // Old-fashioned loop, instead of Array.some, to support jQuery "arrays"
            var i,
                arrLen;
            for ( i = 0, arrLen = array.length; i < arrLen; i++ ) {
                if (isMatch(array[i], i)) {
                    return i;
                }
            }
            return -1;
        
        },

        /**
         * Iterates over all the properties in an object or elements in an array. Differs from
         * $.each in that it always iterates over the properties of an object, even if it has a length
         * property making it look like an array.
         * 
         * @param {*} object The object or array to iterate over.
         * @param {function(value, key)} callback The function that will be executed on every object.
         */
        forEach: function ( object, callback ) {

            this._strict( [ Object, Function ], arguments );

            var keys = Object.keys(object),
                len = keys.length,
                i;
            
            for (i = 0; i < len; i++) {
                callback(object[keys[i]], keys[i]);
            }
        
        },

        forEachElement: function ( selector, fn ) {
		
			var elements = document.querySelectorAll(selector),
				ellen = elements.length; 

			for ( var i = 0; i < ellen; i++ ){
				fn( elements[i], i );
			}

		},
        
        /**
         * Iterates over all the properties in an object or elements in an array. If a callback returns a
         * truthly value then it will immediately return true, if not, it will return false. Differs from
         * $.each in that it always iterates over the properties of an object, even if it has a length
         * property making it look like an array.
         * 
         * @param {*} object The object or array to iterate over.
         * @param {function(value, key)} callback The function that will be executed on every object.
         * @return {boolean}
         */
        some: function ( object, callback ) {

            this._strict( [ Object, Function ], arguments );
        
            var keys = Object.keys(object),
                len = keys.length,
                i;
            
            for (i = 0; i < len; i++) {
                if (callback(object[keys[i]], keys[i])) {
                    return true;
                }
            }
            return false;
        
        },

        array_chunk: function ( input, size, preserve_keys ) {

            this._strict( [ Array, Number, Boolean ], arguments );

            //  discuss at: http://phpjs.org/functions/array_chunk/ | original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com) improved by: Brett Zamir (http://brett-zamir.me)
            //        note: Important note: Per the ECMAScript specification, objects may not always iterate in a predictable order
            //   example 1: array_chunk(['Kevin', 'van', 'Zonneveld'], 2);
            //    returns 1: [['Kevin', 'van'], ['Zonneveld']]
            //   example 2: array_chunk(['Kevin', 'van', 'Zonneveld'], 2, true);
            //     returns 2: [{0:'Kevin', 1:'van'}, {2: 'Zonneveld'}]
            //   example 3: array_chunk({1:'Kevin', 2:'van', 3:'Zonneveld'}, 2);
            //    returns 3: [['Kevin', 'van'], ['Zonneveld']]
            //   example 4: array_chunk({1:'Kevin', 2:'van', 3:'Zonneveld'}, 2, true);
            //     returns 4: [{1: 'Kevin', 2: 'van'}, {3: 'Zonneveld'}]
 
            var x, 
                p = '',
                i = 0,
                c = -1,
                l = input.length || 0,
                n = [];
 
            if (size < 1) {
                return null;
            }
 
            if ( Object.prototype.toString.call(input) === '[object Array]' ) {
                
                if (preserve_keys) {
                
                    while (i < l) {
                        (x = i % size) ? n[c][i] = input[i] : n[++c] = {}, n[c][i] = input[i];
                        i++;
                    }
                
                } else {

                    while (i < l) {
                        (x = i % size) ? n[c][x] = input[i] : n[++c] = [input[i]];
                        i++;
                    }
                }
            
            } else {

                if (preserve_keys) {
                    
                    for (p in input) {
                        if (input.hasOwnProperty(p)) {
                            (x = i % size) ? n[c][p] = input[p] : n[++c] = {}, n[c][p] = input[p];
                            i++;
                        }
                    }
                } else {

                    for (p in input) {
                        if (input.hasOwnProperty(p)) {
                            (x = i % size) ? n[c][x] = input[p] : n[++c] = [input[p]];
                            i++;
                        }
                    }
                }
            
            }

            return n;

        },
        getDataUri: function ( url, callback ) {

            this._strict( [ String, Function ], arguments );

            var image = new Image();

            image.onload = function () {

                var canvas = document.createElement('canvas');
                canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
                canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

                canvas.getContext('2d').drawImage(this, 0, 0);

                callback( canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '') );

            };

            image.src = url;

        },

        poll: function ( fn, callback, errback, timeout, interval ) {

            this._strict( [ Function, Function. Function, Number, Number ], arguments );

            var endTime = Number(new Date()) + (timeout || 2000);
            interval = interval || 100;

            ( function p() {
                    // If the condition is met, we're done! 
                    if( fn() ) {
                        callback();
                    }
                    // If the condition isn't met but the timeout hasn't elapsed, go again
                    else if ( Number(new Date()) < endTime ) {
                        setTimeout(p, interval);
                    }
                    // Didn't match and too much time, reject!
                    else {
                        errback(new Error('timed out for ' + fn + ': ' + arguments));
                    }
            } )();

        },
        setCookie: function (name, value) {
			
			this._strict( [ String, String ], arguments );
	
			if( name != '' )
				document.cookie = name + '=' + value;
		
		},
		getCookie: function (name) {

			this._strict( [ String ], arguments );

			if ( name == '' ) 
				return('');

			name_index = document.cookie.indexOf( name + '=' );

			if( name_index == -1 ) 
				return('');

			cookie_value = document.cookie.substr( name_index + name.length + 1, document.cookie.length );

			//All cookie name-value pairs end with a semi-colon, except the last one. 
			end_of_cookie = cookie_value.indexOf(';'); 

			if( end_of_cookie != -1 ) 
				cookie_value = cookie_value.substr(0, end_of_cookie); 

			//Restores all the blank spaces. 
			space = cookie_value.indexOf('+'); 

			while( space != -1 ) { 

				cookie_value = cookie_value.substr(0, space) + ' ' + cookie_value.substr(space + 1, cookie_value.length); space = cookie_value.indexOf('+'); 

			} 

			return( cookie_value ); 

		},
        /**
         * Returns true if the object has the specified property.
         * This calls the Object.prototype.hasOwnProperty function directly, rather than
         * depending on the object having a function named "hasOwnProperty". This way the
         * object *can* have a property named "hasOwnProperty" that is not a function.
         *
         * @param {*} object The object to test
         * @param {string} property The name of the property to query
         * @return {boolean} True if the object contains the property
         */
        hasProperty: function ( object, property ) {

            this._strict( [ Object, String ], arguments );
            
            return Object.prototype.hasOwnProperty.call(object, property);

        },

        _serialize: function ( obj ) {

            this._strict( [ Object ], arguments );

            var str = [];
            for(var p in obj) {
                // checking for hasOwnProperty prevents accidentlty serializing methods of the object or other ish
                if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
            }
            return str.join("&");
        
        },

        _strict: function ( types, args ) {

            // Make sure that the number of types and args matches
            if ( types.length != args.length ) {
                // If they do not, throw a useful exception
                throw "Invalid number of arguments. Expected " + types.length + ", received " + args.length + " instead.";
            }
            // Go through each of the arguments and check their types
            for ( var i = 0; i < args.length; i++ ) {
                if ( args[i].constructor != types[i] ) {
                    throw "Invalid argument type. Expected " + types[i].name + ", received " + args[i].constructor.name + " instead.";
                }
            }
        
        }

    }
    
    // Define public API
    exports.Utils       = Utils;

});