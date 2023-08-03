// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
// import "@hotwired/turbo-rails"
// import "controllers"

// Éléments contenant le contenue des popup, un par popup
const address_explaination_element = document.createElement('div');
address_explaination_element.innerHTML = `Each address has a percentage that corresponds to its share of the total money to be sent`

const delay_explaination_element = document.createElement('div');
delay_explaination_element.innerHTML = `Each slider represents an address, and the bar corresponds to a time range between 0 and 72 hours`

// Code pour initialiser les popup avec la librarie tippy.js
tippy.one('#address-explaination', {
  arrow: true,
  html: address_explaination_element,
  placement: 'right-end',
})

tippy.one('#delay-explaination', {
  arrow: true,
  html: delay_explaination_element,
  placement: 'right-end',
})

// Toutes les fonction JS exploité
$(document).ready(function() {

  // Compte les adresses affiché, n'est plus utilisé
  function count_address_display() {
    const address = $('.infos-address-container')
    let nb_address_display = 0

    address.each(function() {
      if ($(this).css('display') == 'flex') {
        nb_address_display++
      }
    })

    return nb_address_display
  }

  // Définie un tableau de correspondance exprimant quel adresses est affiché
  // Exemple (1 = affiché, 0 = masquer): [1, 0, 1, 0, 0, 0, 0, 0, 1, 1]
  function which_address_display() {
    const address = $('.infos-address-container')
    let tab_address_display = []

    address.each(function() {
      if ($(this).css('display') == 'flex') {
        tab_address_display.push(1)
      }
      else {
        tab_address_display.push(0)
      }
    })
    return tab_address_display
  }

  // Rajoute une adresse lorsqu'on clique sur le bouton
  $('#add-address-btn').on('click', function() {

    // Stock l'index de la première adresse pas affiché en cherchant le premier 0 dans le tableau de correspondance
    let index_address_to_show = $.inArray(0, which_address_display())
    // Associe cette index à l'adresse pour avoir son ID
    let address_to_show = $("#infos-" + (index_address_to_show + 1))

    // Idem
    let cursor_to_show = $("#ac" + (index_address_to_show + 1))
    // Affiche le curseur
    cursor_to_show.css('display', 'flex')

    // Sécurité pour limiter le nombres d'adresses que l'on peut ajouter
    if (address_to_show.length > 0) {
      address_to_show.css('display', 'flex')
    }
    else {
      alert("You can't add more addresses!")
    }
  })

  // Suprimme ou cache tous les éléments nécessaires lorsque l'on appuie sur le bouton de supression
  $('.delete-btn').on('click', function() {
    // Sélectionne le champ de pourcentage le plus proche
    const percent_to_delete = $(this).closest('.infos-address-container').find('.infos.percent input')
    // Réinitialise ça valeur
    percent_to_delete.val("")

    // Idem
    const time_to_delete = $(this).closest('.infos-address-container').find('.infos.minutes p')
    time_to_delete.text("0h 0min")

    // Idem
    const address_to_hide = $(this).closest('.infos-address-container')
    address_to_hide.css('display', 'none')

    // Idem
    const address_to_delete = $(this).siblings('.address')
    address_to_delete.val("")

    // Stock le chiffre de l'adress à masquer en le récupérant du dernier caractère de son ID
    const index_address_to_hide = address_to_hide.attr('id').slice(-1)

    // Associe ce même chiffre à l'ID d'un curseur pour savoir quel curseur doit être affiché
    const cursor_to_hide = $("#ac" + (index_address_to_hide))
    // Cache et reset la position du curseur en question
    cursor_to_hide.css('display', 'none')
    cursor_to_hide.css('left', '0%')
  })

  // Test la valeur entrée dans l'input de pourcentage, la rejete si elle est fausse
  $('input[type="number"]').on('input', function() {
    // Stock l'élément
    const input = $(this)
    // Stock la valeur
    const value = parseFloat(input.val())
    // Test si elle est une valeur, si elle est plus petite que le minimum de l'input et plus grande que le maximum de l'input
    if (isNaN(value) || value < parseFloat(input.attr('min')) || value > parseFloat(input.attr('max'))) {
      // Alert si ce n'est pas bon et rester la valeur au minimum
      alert("Enter a valid percentage between 0 and 100!")
      input.val(input.attr('min'));
    }
  })

  $('#continue-btn-1').on('click', function percent_verification() {
    // Variable de stockage pour la vérification
    let total_percentage = 0.0
    let time_set_nb = 0

    // Index de la première adresse masquer
    let index_address = $.inArray(0, which_address_display())

    // Tableau de correspondance des adresses affiché
    let tab_address_display = which_address_display()
    // Compteur pour des boucles
    let i = 0
    let j = 0

    // Varibale pour ne pas affiché le message d'alert autant de fois qu'il n'y à de problème
    let alert_trigger = false
    // Variable de détection pour passer à l'étape suivante
    let isOk = false

    // Test chaque input et calcul la somme total
    $('.infos.percent input').each(function() {
      // Première boucle pour ne récupérer que les input qui sont visible
      if(tab_address_display[i] === 1) {

        // Boucle de débug pour le dernier input (10), solution bricolé
        if (index_address === -1) {
          index_address = tab_address_display.length;
        }

        // Seconde boucle pour calculer la somme total
        $('.infos.percent input').each(function() {
          // Vérifie qu'il n'y ai pas de valeur null
          if ($('#s' + index_address).find('input').val() == 0 || $('#s' + index_address).find('input').val() == null) {
            if (!alert_trigger) {
              alert('You can\'t send an address with 0%! Please verify and try again.')
              alert_trigger = true
            }
          }
        })
        // Le pourcentage total des input visible
        total_percentage += parseFloat($(this).val())
      }
      i++
    })

    // Test pour chaque pourcentage s'il est définie, c'est-à-dire s'il n'est pas égal au text par défaut
    $('.infos.minutes p').each(function() {
      // Même système que pour les input, pour ne prendre que ce qui sont visible, c'est à ça que sert le tableau de correspondance
      if(tab_address_display[j] === 1) {
        if ($(this).text() == "0h 0min") {
          if (!alert_trigger) {
            alert('You don\'t have set the send time of an address! Please verify and try again.')
            alert_trigger = true
          }
        }
        else {
          time_set_nb++
        }
      }
      j++
    })

    // Test pourcentage
    if (total_percentage === 100.0) {
      isOk = true
    } else {
      alert("Your total distribution doesn't add up to 100%! Please verify and try again.")
    }

    // Passe à l'étape suivant si tous est bon
    if (isOk) {
      $('#spliting').css('display', 'none')
      $('#display').css('display', 'none')
      $('#popup').css('display', 'flex')
    }
  })

  // Passe à l'étape suivante si toutes les checkbox sont coché, ou plutôt si aucune n'est pas coché
  $('#continue-btn-2').on('click', function all_check_verification() {
    if ($('input[type="checkbox"]:not(:checked)').length > 0) {
      alert("You have not checked all the boxes. Please carefully read and accept the terms and conditions.");
    } else {
      // Insérez ici la suite de votre code, submit les infos des adresses etc.
    }
  })

  // Définie le comportement des curseurs sur l'action de rester appuyé en click
  $('.progress-cursor').on('mousedown', function() {
    // Stock l'ID
    let cursorID = $(this).attr('id')
    // Variable définissant si l'on déplace le curseur
    let isDragging = true
    // Stock la taille de la progress-bar, nécessaire pour des conversion futur
    let progressBarWidth = $('.progress-bar').width()

    // Lorsque la souris bouge
    $(document).on('mousemove', function(e) {
      // Si l'on déplace un curseur
      if (isDragging) {
        // Position à laquel on veux se déplacer
        let offsetX = e.clientX - $('.progress-bar').offset().left - $('.progress-cursor').width() / 2
        offsetX = Math.min(Math.max(offsetX, 0), progressBarWidth)
        // Déplace ce curseur en nombre de pixel à la position
        $('#' + cursorID).css('left', offsetX + 'px')

        // Stock le pourcentage de pixel de la postion du curseur sur l'ensemble de la bar, combien de pourcent le segment début - curseur de la bar total
        let percent_of_max_px = Math.round((offsetX / $('.progress-bar').width()) * 100)
        // Le traduit en fraction pour des caculs
        let fraction = percent_of_max_px / 100

        // Nombres d'heures maximum associé à la bar, la barre est compté en pixel, donc ont peux faire un produit en croix pour définir le nombres d'heures en fonction du nombres de pixel
        let max_hours = 72

        // Calcul du total des minutes (plus simple de convertir ensuite)
        let totalMinutes = fraction * max_hours * 60;

        // Convertie ce total en heures / minutes
        let hours = Math.floor(totalMinutes / 60);
        let minutes = Math.round(totalMinutes % 60);

        // Stock le chiffre / nombre du curseur correspondant, dans le cas de 10 il faut récupérer 2 caractère dont le '.substring(2)'
        let div_number = cursorID.substring(2)
        // Stock la valeur du temps associé
        let time = $("#s" + div_number).find('.beige')
        // Remplace le text de la valeur du temps par celle calculé auparavant en temps réel
        time.text(hours + "h " + minutes + "min")

        // Note: La fonction est très gourmande est pas assez optimisé, il est possible de faire beaucoup mieux je pense
      }
    })

    // Lorsque l'on leve la souris change la variable disant qu'on ne déplace aucun curseur
    $(document).on('mouseup', function() {
      isDragging = false
      $(document).off('mousemove mouseup')
    })
  })
})
