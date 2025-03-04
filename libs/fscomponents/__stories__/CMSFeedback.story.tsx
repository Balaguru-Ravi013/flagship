// We don't need to worry about translating the element
// strings in this file since this is mainly a demo

import React from 'react';

import { Text, View } from 'react-native';

import { object, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { CMSFeedback } from '../src/components/CMSFeedback';

const bodyTextStyle = {
  marginBottom: 10,
};

storiesOf('CMSFeedback', module).add('basic usage', () => {
  const bodyTextFirst = text(
    'bodyTextFirst',
    'For feedback about the mobile site, please complete the survey below.'
  );
  const bodyTextSecond = text(
    'bodyTextSecond',
    'For customer service requests, please call ' +
      '800-555-5555 or view the customer service page.'
  );

  const renderModalBody = () => (
    <View>
      <Text style={object('bodyText', bodyTextStyle)}>{bodyTextFirst}</Text>
      <Text style={object('bodyText', bodyTextStyle)}>{bodyTextSecond}</Text>
    </View>
  );
  return (
    <CMSFeedback
      propertyId="443"
      renderModalBody={renderModalBody}
      successMessage={text('successMessage', 'Thank you for your feedback.')}
    />
  );
});
