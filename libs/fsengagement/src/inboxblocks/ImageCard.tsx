import React from 'react';

import { DeviceEventEmitter, TouchableOpacity } from 'react-native';

import { useNavigator } from '@brandingbrand/fsapp';
import { Navigator } from '@brandingbrand/fsapp/legacy';

import { CardContext, EngagementContext } from '../lib/contexts';
import type { Action, CardProps, JSON } from '../types';

import { CTABlock } from './CTABlock';
import { ImageBlock } from './ImageBlock';
import { TextBlock } from './TextBlock';

export interface ComponentProps extends CardProps {
  contents: any;
  actions?: Action;
}

export const ImageCard: React.FunctionComponent<ComponentProps> = React.memo((props) => {
  const navigator = props.discoverPath ? useNavigator() : props.navigator;
  const { handleAction } = React.useContext(EngagementContext);
  const { containerStyle, contents } = props;

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
    const { actions, story, storyGradient } = props;
    if (!handleAction) {
      return;
    }
    // if there is a story attached and either
    //    1) no actions object (legacy engagement)
    //    2) actions.type is null or 'story' (new default tappable cards)

    const actionPayload: any = storyGradient ? { ...story, storyGradient } : { ...story };

    if (story && (!actions || (actions && (actions.type === null || actions.type === 'story')))) {
      if (story.html) {
        handleAction({
          type: 'blog-url',
          value: story.html.link,
        });
      } else {
        return handleStoryAction(actionPayload);
      }
    } else if (actions && actions.type) {
      handleAction(actions);
    }
  };

  return (
    <CardContext.Provider
      value={{
        story: props.story,
        handleStoryAction,
        cardActions: props.actions,
        id: props.id,
        name: props.name,
        isCard: true,
      }}
    >
      <TouchableOpacity style={containerStyle} activeOpacity={0.9} onPress={onCardPress}>
        <ImageBlock
          {...contents.Image}
          {...{ ...contents.Image, outerContainerStyle: containerStyle }}
        />
        <TextBlock {...contents.Text} />
        <CTABlock {...contents.CTA} story={props.story} />
      </TouchableOpacity>
    </CardContext.Provider>
  );
});
