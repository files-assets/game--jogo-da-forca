(function ($) {
  'use strict';

  var Game = function () {
    var self = this;

    self._state = false;
    self._tries = 8;
    self._is_letter = {};
    self._letters = [
      'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'break',
      'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'break',
      'z', 'x', 'c', 'v', 'b', 'n', 'm'
    ];
  };

  Game.prototype.setValue = function (val) {
    var self = this;

    self._state = true;
    self._value = val;

    $('.resolve-word').text(val.toUpperCase());

    return self;
  };

  Game.prototype.upTries = function () {
    var self = this;

    $('#tries-view').text(self._tries);
  };

  Game.prototype.init = function () {
    var self = this;
    console.log('O valor é: ' + self._value);

    $('#step-1')
      .hide()
    ;

    $('#step-2')
      .show()
    ;

    self.upTries();
    self.createWordZone();
    self.createTypeZone();

    return self;
  };

  Game.prototype.createWordZone = function () {
    var self = this;

    var $zone = $('#word-aria');

    $.each(self._value.split(' '), function (index, value) {
      var $word = $('<div>');

      var l = value.length;
      for (var i = 0; i < l; i++) {
        $('<span>')
          .addClass('lsz-word-letter')
          .attr('data-letter', value.charAt(i).toLowerCase())
          .attr('data-index', index + '--' + i)
          .attr('data-is-visible', 'false')
          .text('—')
          .appendTo($word)
        ;

        self._is_letter[value.charAt(i).toLowerCase()] = true;
      }

      $word
        .addClass('lsz-word')
        .appendTo($zone)
      ;
    });

    return self;
  };

  Game.prototype.createTypeZone = function () {
    var self = this;

    var $zone = $('#type-aria');

    $.each(self._letters.join('').split('break'), function (index, row) {
      var $row = $('<div>');

      var l = row.length;
      for (var i = 0; i < l; i++) {
        $('<span>')
          .addClass('lsz-keyboard-letter')
          .attr('data-letter', row.charAt(i).toLowerCase())
          .attr('data-is-correct', self._is_letter[row.charAt(i).toLowerCase()] === true)
          .text(row.charAt(i).toUpperCase())
          .appendTo($row)
          .on('click', function () {
            var $this = $(this);

            if ($this.is('disabled')) {
              return;
            }

            $this.addClass('disabled');

            if ($this.attr('data-is-correct') === 'true') {
              $this.addClass('is-in-success');

              $('.lsz-word-letter[data-letter="' + $this.attr('data-letter') + '"]')
                .text($this.text())
                .attr('data-is-visible', 'true')
              ;
            } else {
              $this.addClass('is-in-danger');

              self._tries--;
              self.upTries();
            }

            if ($('.lsz-word-letter[data-is-visible="false"]').length === 0) {
              $('#step-2').hide();
              $('#success').show();
            }

            if (self._tries === 0) {
              $('#step-2').hide();
              $('#danger').show();
            }
          })
        ;
      }

      $row
        .addClass('lsz-keyboard-row')
        .appendTo($zone)
      ;
    });
  };

  Game.prototype.getState = function () {
    var self = this;

    return self._state;
  };

  $('#game-form-init').on('submit', function (event) {
    event.preventDefault();

    var $form = $(this);

    var GameInstance = new Game();

    if (GameInstance.getState()) return;

    GameInstance
      .setValue($form.find('#step-1-word').val())
      .init()
    ;
  });
}(jQuery));
