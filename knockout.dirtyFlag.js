// By: Hans Fjällemark and John Papa
// https://github.com/CodeSeven/KoLite
//
// Knockout.DirtyFlag
//
// John Papa
//          http://johnpapa.net
//          http://twitter.com/@john_papa
//
// Depends on scripts:
//          Knockout
//
//  Notes:
//          Special thanks to Steve Sanderson and Ryan Niemeyer for
//          their influence and help.
//
//  Usage:
//          To Setup Tracking, add this tracker property to your viewModel
//              ===> viewModel.dirtyFlag = new ko.DirtyFlag(viewModel.model);
//
//          Hook these into your view ...
//              Did It Change?
//              ===> viewModel.dirtyFlag().isDirty();
//
//          Hook this into your view model functions (ex: load, save) ...
//              Resync Changes
//              ===> viewModel.dirtyFlag().reset();
//
//          Optionally, you can pass your own hashFunction for state tracking.
//
////////////////////////////////////////////////////////////////////////////////////////

(function (factory) {
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        factory(require("knockout"), exports);
    } else if (typeof define === "function" && define["amd"]) {
        define(["knockout", "exports"], factory);
    } else {
        factory(ko, ko);
    }
}(function (ko, exports) {
    if (typeof (ko) === undefined) {
        throw 'Knockout is required, please ensure it is loaded before loading the dirty flag plug-in';
    }

    function getFirstDiffIndex(oldText, newText) {
        // Find the index at which the change began
        var s = 0;
        while (s < oldText.length && s < newText.length && oldText[s] == newText[s]) {
            s++;
        }

        return s;
    };

    function getPropertyAndValueFromString(str, index) {
        var beginOfValue = str.lastIndexOf(":", index);
        var endOfValue = str.indexOf(",", index);

        var beginOfProperty = str.lastIndexOf(",", index);

        return str.substring(beginOfProperty + 1, endOfValue);
    };

    exports.DirtyFlag = function (objectToTrack, isInitiallyDirty, hashFunction) {

        hashFunction = hashFunction || ko.toJSON;
        var item = this;

        var _objectToTrack = objectToTrack;
        var _lastCleanState = ko.observable(hashFunction(_objectToTrack));
        var _isInitiallyDirty = ko.observable(isInitiallyDirty);

        var result = function () {

            item.forceDirty = function () {
                _isInitiallyDirty(true);
            };

            item.isDirty = ko.computed(function () {
                return _isInitiallyDirty() || hashFunction(_objectToTrack) !== _lastCleanState();
            });

            item.reset = function () {
                _lastCleanState(hashFunction(_objectToTrack));
                _isInitiallyDirty(false);
            };

            item.logState = function () {
                if (console && typeof console.log === "function") {
                    console.log("LastCleanState: " + _lastCleanState());
                    console.log("CurrentState: " + hashFunction(_objectToTrack));
                }
            };

            item.displayDiff = function () {
                if (console && typeof console.log === "function") {
                    var lcs = _lastCleanState();
                    var cs = hashFunction(_objectToTrack);

                    var index = getFirstDiffIndex(lcs, cs);
                    var lcsDisplay = getPropertyAndValueFromString(lcs, index);
                    var csDisplay = getPropertyAndValueFromString(cs, index);

                    console.log("LastCleanState Changed Property: " + lcsDisplay);
                    console.log("CurrentState Changed Property: " + csDisplay);
                }
            };

            return item;
        };

        return result();
    };
}));
