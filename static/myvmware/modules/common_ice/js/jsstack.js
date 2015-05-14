/**
 * This JS file contains the set of functions for performing stack operations using Array primitive data structure
 * 
 * @author Praveer Sengaru (psengaru@vmware.com)
 *
 *
 */
 
vmf.ns.use("vmf.data");

Stack = (function () {
    var FUNCTION = "function";

    function Stack() {
        this.stack = new Array(); //Use Array List as primitive data structure for this implementation
    }
    Stack.prototype.push = function (o) {
        this.stack.push(o);
    }
    Stack.prototype.pop = function () {
        return this.stack.pop();
    }
    Stack.prototype.peek = function () {
        return this.stack[this.stack.length - 1];
    }
    Stack.prototype.size = function () {
        return this.stack.length;
    }
    Stack.prototype.isEmpty = function () {
        if (this.stack.length == 0) {
            return true;
        } else {
            return false;
        }
    }

    return Stack;
})();

vmf.data.Stack = Stack;