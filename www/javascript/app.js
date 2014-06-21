jQuery( document ).ready(function( $ ) {
	if( $('input[name="search"]').length > 0 ){
		$('input[name="search"]').on('keyup', function(evt){

			$('article p:not(:contains("'+$(this).val()+'"))').parent().fadeOut()
			$('article h3:not(:contains("'+$(this).val()+'"))').parent().fadeOut()
			$('article p:contains("'+$(this).val()+'")').parent().fadeIn()
			$('article h3:contains("'+$(this).val()+'")').parent().fadeIn()

			if($(this).val().length <= 0){
				$('article').fadeIn()		
			}
		})

		$('input[name="search"]').on('blur', function(evt){
			if($(this).val().length <= 0){
				$('article').fadeIn()		
			}
		})
	}
})