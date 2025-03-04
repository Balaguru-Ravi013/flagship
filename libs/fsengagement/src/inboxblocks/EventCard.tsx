import React from 'react';

import { DeviceEventEmitter, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useNavigator } from '@brandingbrand/fsapp';
import { Navigator } from '@brandingbrand/fsapp/legacy';

import timeIcon from '../../assets/images/time.png';
import whenIcon from '../../assets/images/whenIcon.png';
import whereIcon from '../../assets/images/whereIcon.png';
import { CardContext } from '../lib/contexts';
import type { CardProps, JSON } from '../types';

import { CTABlock } from './CTABlock';
import { ImageBlock } from './ImageBlock';
import { TextBlock } from './TextBlock';

const styles = StyleSheet.create({
  whenIcon: {
    width: 13,
    height: 13,
  },
  timeIcon: {
    width: 14,
    height: 14,
  },
  whereIcon: {
    width: 10,
    height: 14,
  },
  eventContainer: {
    marginLeft: 50,
    paddingLeft: 100,
  },
  eventType: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  imageContainer: {
    position: 'absolute',
    left: 30,
    top: 40,
  },
  dateRow: {
    width: 12,
    paddingTop: 2,
    alignItems: 'center',
    marginRight: 5,
  },
});

export interface ComponentProps extends CardProps {
  contents: any;
}

export const EventCard: React.FunctionComponent<ComponentProps> = React.memo((props) => {
  const navigator = props.discoverPath ? useNavigator() : props.navigator;
  const { contents } = props;

  const handleStoryAction = async (json: JSON) => {
    DeviceEventEmitter.emit('viewStory', {
      title: props.name,
      id: props.id,
    });

    if (!navigator) {
      return;
    }
    if (props.discoverPath && !(navigator instanceof Navigator)) {
      navigator.open(`${props.discoverPath}/${props.id}`, {
        json,
        backButton: true,
        name: props.name,
        discoverPath: props.discoverPath,
      });
      return;
    }
    return navigator.push({
      component: {
        name: 'EngagementComp',
        options: {
          topBar: {
            visible: false,
          },
        },
        passProps: {
          json,
          backButton: true,
          name: props.name,
          id: props.id,
        },
      },
    });
  };

  const onCardPress = async (): Promise<void> => {
    const { story, storyGradient } = props;
    const actionPayload: any = storyGradient ? { ...story, storyGradient } : { ...story };
    return handleStoryAction(actionPayload);
  };

  return (
    <CardContext.Provider
      value={{
        story: props.story,
        handleStoryAction,
      }}
    >
      <TouchableOpacity activeOpacity={0.9} onPress={onCardPress}>
        <View style={[props.containerStyle, styles.eventContainer]}>
          <TextBlock {...contents.Title} />
          {!contents.When.textDate && !contents.When.textTime && (
            <View style={styles.eventType}>
              <ImageBlock
                source={whenIcon}
                containerStyle={styles.dateRow}
                imageStyle={styles.whenIcon}
              />
              <TextBlock {...contents.When} />
            </View>
          )}
          {contents.When.textDate && (
            <View style={styles.eventType}>
              <ImageBlock
                source={whenIcon}
                containerStyle={styles.dateRow}
                imageStyle={styles.whenIcon}
              />
              <TextBlock {...{ ...contents.When, text: contents.When.textDate }} />
            </View>
          )}
          {contents.When.textTime && (
            <View style={styles.eventType}>
              <ImageBlock
                source={timeIcon}
                containerStyle={styles.dateRow}
                imageStyle={styles.timeIcon}
              />
              <TextBlock {...{ ...contents.When, text: contents.When.textTime }} />
            </View>
          )}

          <View style={styles.eventType}>
            <ImageBlock
              source={whereIcon}
              containerStyle={styles.dateRow}
              imageStyle={styles.whereIcon}
            />
            <TextBlock {...contents.Where} />
          </View>
          <CTABlock {...contents.CTA} story={props.story} />
        </View>
        <View style={styles.imageContainer}>
          <ImageBlock {...contents.Image} />
        </View>
      </TouchableOpacity>
    </CardContext.Provider>
  );
});
