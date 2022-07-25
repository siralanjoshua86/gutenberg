<?php
/**
 * WP_Style_Engine_CSS_Rules_Store
 *
 * A store for WP_Style_Engine_CSS_Rule objects.
 *
 * @package Gutenberg
 */

if ( class_exists( 'WP_Style_Engine_CSS_Rules_Store' ) ) {
	return;
}

/**
 * Holds, sanitizes, processes and prints CSS declarations for the style engine.
 *
 * @access private
 */
class WP_Style_Engine_CSS_Rules_Store {

	/**
	 * An array of named WP_Style_Engine_CSS_Rules_Store objects.
	 *
	 * @static
	 *
	 * @var WP_Style_Engine_CSS_Rules_Store[]
	 */
	protected static $stores = array();

	/**
	 * An array of CSS Rules objects assigned to the store.
	 *
	 * @var WP_Style_Engine_CSS_Rule[]
	 */
	protected $rules = array();

	/**
	 * Get an instance of the store.
	 *
	 * @param string $store_name The name of the store.
	 *
	 * @return WP_Style_Engine_CSS_Rules_Store
	 */
	public static function get_store( $store_name = 'default' ) {
		if ( ! isset( static::$stores[ $store_name ] ) ) {
			static::$stores[ $store_name ] = new static();
		}
		return static::$stores[ $store_name ];
	}

	/**
	 * Get an array of all available stores.
	 *
	 * @return WP_Style_Engine_CSS_Rules_Store[]
	 */
	public static function get_stores() {
		return static::$stores;
	}

	/**
	 * Get an array of all rules.
	 *
	 * @return WP_Style_Engine_CSS_Rule[]
	 */
	public function get_all_rules() {
		return $this->rules;
	}

	/**
	 * Get a WP_Style_Engine_CSS_Rule object by its selector.
	 * If the rule does not exist, it will be created.
	 *
	 * @param string $selector The CSS selector.
	 *
	 * @return WP_Style_Engine_CSS_Rule|null Returns a WP_Style_Engine_CSS_Rule object, or null if the selector is empty.
	 */
	public function add_rule( $selector ) {

		$selector = trim( $selector );

		// Bail early if there is no selector.
		if ( empty( $selector ) ) {
			return;
		}

		// Create the rule if it doesn't exist.
		if ( empty( $this->rules[ $selector ] ) ) {
			$this->rules[ $selector ] = new WP_Style_Engine_CSS_Rule( $selector );
		}

		return $this->rules[ $selector ];
	}

	/**
	 * Remove a selector from the store.
	 *
	 * @param string $selector The CSS selector.
	 *
	 * @return void
	 */
	public function remove_rule( $selector ) {
		unset( $this->rules[ $selector ] );
	}

	/**
	 * Add a store. This method effectively merges the rules of the defined store into the current store,
	 * and removes them from the original store to avoid duplication.
	 *
	 * @param WP_Style_Engine_CSS_Rules_Store $store The store to merge.
	 *
	 * @return WP_Style_Engine_CSS_Rules_Store Returns the merged store.
	 */
	public function add_store( WP_Style_Engine_CSS_Rules_Store $store ) {
		$incoming_rules = $store->get_all_rules();
		foreach ( $incoming_rules as $rule ) {
			$this->add_rule( $rule->get_selector() )->add_declarations( $rule->get_declarations() );
			$store->remove_rule( $rule->get_selector() );
		}
		return $this;
	}
}
