import React, { Component, useContext } from 'react';

import type { ImageStyle, StyleProp, ViewStyle } from 'react-native';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import PropTypes from 'prop-types';

import rightArrow from '../../assets/images/rightArrow.png';
import rightBlockArrow from '../../assets/images/rightBlockArrow.png';
import rightCategoryArrow from '../../assets/images/rightCategoryArrow.png';
import { EngagementContext } from '../lib/contexts';

import { CTABlock } from './CTABlock';
import DividerBlock from './DividerBlock';
import { ImageBlock } from './ImageBlock';
import { TextBlock } from './TextBlock';

const images = {
  rightArrow,
  rightBlockArrow,
  rightCategoryArrow,
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  flexContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexContainerReverse: {
    flexDirection: 'row-reverse',
  },
  rightArrow: {
    width: 8,
    height: 13,
    marginLeft: 10,
  },
  rightBlockArrow: {
    width: 8,
    height: 16,
    marginLeft: 10,
  },
  arrowIconContainer: {
    width: 20,
  },
  rightCategoryArrow: {
    width: 9,
    height: 16,
    marginLeft: 10,
  },
  imageContainer: {
    position: 'absolute',
    left: 30,
    top: 40,
  },
});

export interface IconTextProps {
  contents: any;
  containerStyle?: StyleProp<ViewStyle>;
  link?: string;
  imageAlignment?: string;
}
export type ArrowTypes = 'rightArrow' | 'rightBlockArrow' | 'rightCategoryArrow';

class IconTextBlock extends Component<IconTextProps & { context: any }> {
  public static contextTypes: any = {
    handleAction: PropTypes.func,
  };

  private readonly onPress = (link?: string) => () => {
    if (!link) {
      return;
    }
    const { handleAction } = this.props.context;
    handleAction({
      type: 'deep-link',
      value: link,
    });
  };

  public render(): JSX.Element {
    const { containerStyle, contents, imageAlignment = 'left', link } = this.props;
    const imageDimensions: StyleProp<ImageStyle> = {};
    const iconSpacing: StyleProp<ViewStyle> = contents.Image
      ? {
          marginRight: imageAlignment === 'left' ? contents.Image.iconSpacing || 0 : 0,
          marginLeft: imageAlignment === 'left' ? 0 : contents.Image.iconSpacing || 0,
        }
      : {};

    const iconWidth = (contents.Image && contents.Image.iconWidth) || 0;
    imageDimensions.width = iconWidth;
    imageDimensions.height = contents?.Image?.ratio
      ? iconWidth / Number.parseFloat(contents.Image.ratio)
      : 0;

    const iconType: ArrowTypes = contents?.Icon?.type || 'rightArrow';

    return (
      <>
        <TouchableOpacity activeOpacity={1} onPress={this.onPress(link)} style={containerStyle}>
          <View
            style={[
              styles.flexContainer,
              Boolean(imageAlignment && imageAlignment === 'right') && styles.flexContainerReverse,
            ]}
          >
            {contents.Image && (
              <View style={[styles.iconContainer, { width: iconWidth }, iconSpacing]}>
                <ImageBlock
                  source={contents.Image.source}
                  containerStyle={contents.Image.containerStyle}
                  imageStyle={imageDimensions}
                />
              </View>
            )}
            <View style={{ flex: 1 }}>
              {contents.Eyebrow && contents.Eyebrow.enabled && <TextBlock {...contents.Eyebrow} />}
              <TextBlock {...contents.Text} />
              {contents.CTA && contents.CTA.enabled && <CTABlock {...contents.CTA} />}
            </View>
            {contents.Icon && (
              <Image
                style={[styles[iconType], contents.Icon.iconStyle]}
                source={images[iconType]}
              />
            )}
          </View>
        </TouchableOpacity>
        {contents.Divider && <DividerBlock {...contents.Divider} />}
      </>
    );
  }
}

export default (props: IconTextProps) => {
  const context = useContext(EngagementContext);
  return <IconTextBlock {...props} context={context} />;
};
