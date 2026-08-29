'use client';

import {
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Switch,
  SegmentedButton,
  SegmentedButtonItem,
  Slider,
} from '@m3ui/react';
import { column, narrow } from '../shared';

export function CheckboxDemo() {
  return (
    <CheckboxGroup defaultValue={['email']}>
      <Checkbox label="Email notifications" value="email" />
      <Checkbox label="SMS notifications" value="sms" />
      <Checkbox label="Push notifications" value="push" />
    </CheckboxGroup>
  );
}

export function RadioDemo() {
  return (
    <RadioGroup defaultValue="pro" name="plan">
      <Radio value="free" label="Free" />
      <Radio value="pro" label="Pro" />
      <Radio value="team" label="Team" />
    </RadioGroup>
  );
}

export function SwitchDemo() {
  return (
    <div style={column}>
      <Switch label="Dark mode" defaultChecked />
      <Switch label="Wi-Fi only downloads" />
    </div>
  );
}

export function SegmentedButtonDemo() {
  return (
    <SegmentedButton defaultValue={['day']}>
      <SegmentedButtonItem value="day" label="Day" />
      <SegmentedButtonItem value="week" label="Week" />
      <SegmentedButtonItem value="month" label="Month" />
    </SegmentedButton>
  );
}

export function SliderDemo() {
  return (
    <div style={{ ...column, ...narrow }}>
      <Slider defaultValue={50} label="Volume" showValueIndicator min={0} max={100} />
      <Slider defaultValue={[25, 75]} label="Range" showValueIndicator min={0} max={100} />
    </div>
  );
}
