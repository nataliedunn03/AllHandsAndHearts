'use strict';

const tintColor = '#659CEC';

const defaultColor = {
	BACKGROUND_COLOR: '#F2F2F2',
	PRIMARY_COLOR_OLD: '#659CEC',
	PRIMARY_COLOR: '#5d0e8b',
	PAPER_COLOR: '#FFFFFF',
	SHADOW_COLOR: '#0000001A',
	ACCENT: '#08ce94',
	LIST_BORDER_COLOR: '#E0E0E0',
	PAGE_BACKGROUND: '#F3F3F3'
};

const Typography = {
	FONT: {
		FAMILY: 'rubik-regular',
		WEIGHT: 'normal',
		FONT_WEIGHT: '400',
		SIZE: 16
	},
	HEADING: {
		FONT_SIZE: 25,
		COLOR: '#222222'
	},
	TITLE: {
		FONT_SIZE: 20,
		COLOR: '#222222'
	},
	SUB_TITLE: {
		FONT_SIZE: 15,
		COLOR: '#222222'
	},
	CAPTION: {
		FONT_SIZE: 12,
		COLOR: '#666666'
	},
	TEXT: {
		FONT_SIZE: 15,
		COLOR: '#666666',
		PRIMARY_COLOR: '#FFFFFF'
	}
};

const Navigation = {
	TITLE_TEXT: {
		COLOR: '#222222',
		FONT_SIZE: 15
	},
	ICON: {
		COLOR: '#222222'
	},
	PRIMARY_TITLE: {
		COLOR: '#FFFFFF'
	},
	PRIMARY_ICON: {
		COLOR: '#FFFFFF'
	},
	BACKGROUND: {
		COLOR: '#FFFFFF'
	},
	BOTTOM_BORDER: {
		COLOR: '#F2F2F2'
	}
};
const Overlays = {
	COLOR: '#00000033',
	TEXT_COLOR: '#FFFFFF',
	TAG_OVERLAY_COLOR: '#00000080',
	TAG_OVERLAY_TEXT_COLOR: '#FFFFFF'
};
const MainNavigation = {
	BACKGROUND: {
		COLOR: '#FFFFFF'
	},
	BORDER: {
		COLOR: '#E0E0E0'
	},
	TEXT: {
		COLOR: '#32323266'
	},
	ICON: {
		COLOR: '#32323266'
	},
	ITEM_BACKGROUND: {
		COLOR: '#00000000'
	},
	SELECTED_ITEM: {
		COLOR: '#222222'
	},
	SELECTED: {
		BACKGROUND_COLOR: '#FFFFFF',
		BORDER_COLOR: '#659CEC'
	}
};
const SubNavigation = {
	TEXT: {
		COLOR: '#666666'
	},
	ITEM_BACKGROUND: {
		COLOR: '#00000000'
	}
};
const Buttons = {
	TEXT: {
		COLOR: '#222222',
		FONT_SIZE: 12,
		FONT_WEIGHT: 700,
		FONT_FAMILY: 'rubik-regular'
	},
	BACKGROUND: {
		COLOR: '#FFFFFF',
		BORDER_COLOR: '#FFFFFF',
		SECONDARY_COLOR: '#659CEC',
		SECONDARY_BORDER_COLOR: '#659CEC00'
	}
};
const Separators = {
	LINE: {
		COLOR: '#E5E5E5'
	},
	BACKGROUND: {
		COLOR: '#F2F2F2'
	}
};
const Input = {
	BACKGROUND: {
		COLOR: '#FFFFFF'
	},
	BORDER: {
		COLOR: '#AEAEAE',
		RADIUS: 4
	}
};
export default {
	tintColor,
	tabIconDefault: '#AEAEAE',
	tabIconSelected: defaultColor.PRIMARY_COLOR,
	tabBar: '#fefefe',
	errorBackground: 'red',
	errorText: '#fff',
	warningBackground: '#EAEB5E',
	warningText: '#666804',
	noticeBackground: tintColor,
	noticeText: '#fff',
	secondary: '#000',
	navHeaderBorder: '#F2F2F2',
	navHeaderBackground: '#FFFFFF',
	defaultColor,
	Typography,
	Navigation,
	Overlays,
	MainNavigation,
	SubNavigation,
	Buttons,
	Separators,
	Input
};
