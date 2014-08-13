/**
 * @file bmi.js
 * @namespace bmi
 * @author Josef Wachtler
 * This is the main javascript file of the BMI-App.
 */
var _ = document.webL10n.get;
var bmi = {

    /**
     * This object holds the upper limits of the weight classes.
     */
    borders : {
        VERY_SEVERELY_UNDERWEIGHT : 15.99,
        SEVERELY_UNDERWEIGHT : 16.99,
        UNDERWEIGHT : 18.49,
        NORMAL : 24.99,
        OVERWEIGHT : 29.99,
        MODERATELY_OBESE : 34.99,
        SEVERELY_OBESE : 39.99,
        VERY_SEVERELY_OBESE : Number.MAX_VALUE
    },

    /**
     * This object holds the user input (mass and height) as well as
     * the results of the calculation.
     */
    models : {
        mass : 0.0,
        height : 0.0,
        bmi : 0.0,
        min : 0.0,
        max : 0.0
    },

    /**
     * @function bmi.init
     *
     * This function inits the script. It bounds the actions to the events.
     */
    init : function() {
        debug( "init() called" );
        $( "#calc-button" ).click(function() {
            return bmi.run();
        });
        $( "#new-button" ).click(function() {
            bmi.clear();
        });
    },

    /**
     * @function bmi.run
     *
     * This function executes the calculation and sets the results to the
     * result page. Finally it shows this page.
     *
     * @return true on success, false otherwise
     */
    run : function() {
        debug( "run() called" );
        try {
            this.calculate();
            if( isNaN(this.models.bmi) || this.models.bmi == 0.0 ) {
                throw "zero";
            }
            debug( "bmi: " + bmi.models.bmi );
            debug( "min: " + bmi.models.min );
            debug( "max: " + bmi.models.max );
            $( "#bmi-result" ).html( "" + this.models.bmi );
            $( "#min-normal" ).html( "" + this.models.min );
            $( "#max-normal" ).html( "" + this.models.max );
            $( "#mass-input" ).html( "" + this.models.mass );
            $( "#height-input" ).html( "" + this.models.height );
            this.analyze();
            $( ":mobile-pagecontainer" ).pagecontainer( "change", "#result" );
        }
        catch( e ) {
            debug( "run() error" );
            $("#data-error").popup("open");
            return false;
        }
        return true;
    },


    /**
     * @function bmi.calculate
     *
     * This function reads the input values from the index page
     * and performs the calculation.
     *
     * @return true on success, false otherwise
     */
    calculate : function() {
        debug( "calculate() called" );
        this.models.mass = parseFloat( $( "#mass-field" ).val() );
        if( this.models.mass === "" )
            return false;
        debug( "mass: " + this.models.mass );
        this.models.height = parseFloat( $( "#height-field" ).val() );
        if( this.models.height === "" )
            return false;
        debug( "height: " + this.models.height );
        this.models.bmi = round2c( this.models.mass / ( this.models.height *
            this.models.height ));
        debug( "bmi: " + bmi.models.bmi );
        this.models.min = round2c( this.borders.UNDERWEIGHT * (
            this.models.height * this.models.height ) );
        debug( "min: " + bmi.models.min );
        this.models.max = round2c( this.borders.NORMAL * (
            this.models.height * this.models.height ) );
        debug( "max: " + bmi.models.max );
        return true;
    },

    /**
     * @function bmi.analyze
     *
     * This function analyzes the results and shows an according box at
     * th result page.
     */
    analyze : function() {
        debug( "analyze() called" );
        $( ".text-result" ).hide();
        if( this.models.bmi <= this.borders.VERY_SEVERELY_UNDERWEIGHT ) {
            $( "#very_severely_underweight-result" ).show();
        }
        else if( this.models.bmi <= this.borders.SEVERELY_UNDERWEIGHT ) {
            $( "#severely_underweight-result" ).show();
        }
        else if( this.models.bmi <= this.borders.UNDERWEIGHT ) {
            $( "#underweight-result" ).show();
        }
        else if( this.models.bmi <= this.borders.NORMAL ) {
            $( "#normal-result" ).show();
        }
        else if( this.models.bmi <= this.borders.OVERWEIGHT ) {
            $( "#overweight-result" ).show();
        }
        else if( this.models.bmi <= this.borders.MODERATELY_OBESE ) {
            $( "#moderately_obese-result" ).show();
        }
        else if( this.models.bmi <= this.borders.SEVERELY_OBESE ) {
            $( "#severely_obese-result" ).show();
        }
        else if( this.models.bmi <= this.borders.VERY_SEVERELY_OBESE ) {
            $( "#very_severely_obese-result" ).show();
        }

        var adopt = $( "#adopt-normal" ) ;

        if( this.models.bmi < this.borders.UNDERWEIGHT ) {
            var kg = round2c( this.models.min - this.models.mass );
            adopt.show();
            adopt.html(_("adopt-put", { put: kg }));
        }
        else if( this.models.bmi >= this.borders.NORMAL ) {
            var kg = round2c( this.models.mass - this.models.max );
            adopt.show();
            adopt.html(_("adopt-lose", { lose: kg }));
        }
        else {
            adopt.hide();
        }
    },

    /**
     * @function bmi.clear
     *
     * This function clears the models and the input fields.
     */
    clear : function() {
        debug( "clear() called" );
        this.models.mass = 0.0;
        this.models.height = 0.0;
        this.models.bmi = 0.0;
        this.models.min = 0.0;
        this.models.max = 0.0;
        $( "#mass-field" ).val("");
        $( "#height-field" ).val("");
    }
};
