  $(document).ready(function() {
    var calculator = calculatorApp();

    $('.btn-number').click(function() {
      var number = parseInt($(this).html());
      calculator.clickNumber(number);
    });

    $('.btn-operator').click(function() {
      var operator = $(this).html();
      calculator.clickOperator(operator);
    });

    $('#btn-decimal').click(function() {
      calculator.clickDecimal();
    });

    $('#btn-clear').click(function() {
      calculator.clearStack();
    });

    $('#btn-calculate').click(function() {
      calculator.calculate();
    });

    $('#btn-undo').click(function() {
      calculator.undo();
    });

  });

  function calculatorApp() {
    var stack = [],
      is_float = false;
    var operators = ['-', '×', '÷', '+', '%'];

    return {
      clickNumber: clickNumber,
      clickOperator: clickOperator,
      clickDecimal: clickDecimal,
      clearStack: clearStack,
      undo: undo,
      calculate: calculate
    }

    function clickDecimal() {

      if (operators.indexOf(stack[stack.length - 1]) !== -1 || stack.length === 0) {
        stack.push(0);
        stack.push('.');
        is_float = true;
        updateView();
      }

      if (!(isNaN(stack[stack.length - 1])) && is_float === false) {
        stack.push('.');
        is_float = true;
        updateView();
      }

    }

    function clickNumber(num) {
      if (!isNaN(num)) {
        if (stack[stack.length - 1] === 0 && num === 0 && is_float === false) {
          stack.pop();
        }
        stack.push(num);
        updateView();
      }

    }

    function clickOperator(operator) {
      if (operators.indexOf(operator) !== -1) {
        if (operators.indexOf(stack[stack.length - 1]) !== -1) {
          stack.pop();
        }
        if (stack[stack.length - 1] === '.') {
          stack.pop();
        }
        stack.push('|');
        stack.push(operator);
        is_float = false;
        updateView();
      }
    }

    function clearStack() {
      stack = [];
      updateView();

    }

    function undo() {
      if (is_float && stack[stack.length - 1] === '.') {
        is_float = false;
      }
      if (operators.indexOf(stack[stack.length - 1]) !== -1) {
        stack.pop(); // pop the operator
        stack.pop(); // then the 
      } else {
        stack.pop();

      }
      updateView();
    }

    function calculate() {
      var items = [],
        result = 0,
        operator = null,
        number = 0;
      if (stack[stack.length - 1] === '.') {
        stack.pop();
      }
      if (operators.indexOf(stack[stack.length - 1]) !== -1) {
        stack.pop();
        stack.pop();
      }

      items = stack.join('').split('|');
      for (var i = 0; i < items.length; i++) {
        // if this is the first item, just assign it to result
        if (i === 0) {
          // use parseFloat because the other numbers in the stack might be floating numbers
          result = parseFloat(items[i]);
        } else {
          // get the number
          number = items[i].substr(1);
          operator = items[i].charAt(0);
          
          if (operator === '+') {
            result += parseFloat(number);
          }

          if (operator === '-') {
            result -= parseFloat(number);
          }

          if (operator === '×') {
            result *= parseFloat(number);
          }

          if (operator === '÷') {
            result /= parseFloat(number);
          }

          if (operator === '%') {
            result %= parseFloat(number);
          }

        }
      }

      if (result.toString().split('').indexOf('.') !== -1) {
        var decimals = result.toString().split('.');
        if (decimals[1].length > 7) {
          result = result.toFixed(7);
        }
      }

      jQuery('#current-stack').html(result);

      if (result.length >= 15) {
        jQuery('#current-stack').addClass('text-sm');
      } else {
        jQuery('#current-stack').removeClass('text-sm');
      }

      stack = [result];
    }

    function updateView() {
      var items = [],
        stack_to_display = [],
        last_number = 0;

      // if stack is empty, display zero 
      if (stack.length === 0) {
        jQuery('#current-stack').html('0');
        return;
      }

      items = stack.join('').split('|');

      for (var i = 0; i < items.length; i++) {

        if (i === 0) {
          stack_to_display.push(parseFloat(items[i]));
        } else {
          stack_to_display.push(items[i].charAt(0));
          stack_to_display.push(items[i].substr(1));
        }
      }

      jQuery('#current-stack').html(stack_to_display.join(''));

      if (stack_to_display.join('').length >= 15) {
        jQuery('#current-stack').addClass('text-sm');
      } else {
        jQuery('#current-stack').removeClass('text-sm');
      }

    }

  }