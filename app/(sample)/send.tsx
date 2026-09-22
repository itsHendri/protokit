import { AmountInput } from '@/components/kit/amount-input';
import { SummaryCard } from '@/components/kit/key-value-list';
import { ListRow } from '@/components/kit/list-row';
import { NumericKeypad } from '@/components/kit/numeric-keypad';
import { Stepper } from '@/components/kit/stepper';
import { StickyBottomBar } from '@/components/kit/sticky-bottom-bar';
import { SuccessScreen } from '@/components/kit/success-screen';
import { SwipeToConfirm } from '@/components/kit/swipe-to-confirm';
import { CONTACTS, money } from '@/components/sample/data';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

type Step = 'amount' | 'recipient' | 'review' | 'done';
const ORDER: Step[] = ['amount', 'recipient', 'review', 'done'];

/**
 * Multi-step flow pattern: one route, a Step state machine, one Stepper, one StickyBottomBar.
 */
export default function SendFlow() {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>('amount');
  const [amount, setAmount] = React.useState('');
  const [recipient, setRecipient] = React.useState<(typeof CONTACTS)[number] | null>(null);
  const value = Number(amount) || 0;
  const stepIndex = ORDER.indexOf(step) + 1;

  if (step === 'done') {
    return (
      <View className="bg-background flex-1">
        <SuccessScreen title="Money sent" amount={money(value)} amountSubtitle={`to ${recipient?.name}`} body="It will arrive within a few seconds." />
        <StickyBottomBar transparent>
          <Button onPress={() => router.back()}>
            <Text>Done</Text>
          </Button>
        </StickyBottomBar>
      </View>
    );
  }

  return (
    <View className="bg-background flex-1">
      <ScrollView contentContainerClassName="gap-5 p-5 pb-32" keyboardShouldPersistTaps="handled">
        <Stepper current={stepIndex} total={3} labels={['Amount', 'Recipient', 'Review']} />

        {step === 'amount' ? (
          <View className="gap-5">
            <AmountInput value={amount} onChangeText={setAmount} symbol="$" editable={false} helper="Available $4,820.55" onMax={() => setAmount('4820.55')} />
            <NumericKeypad value={amount} onChange={setAmount} />
          </View>
        ) : null}

        {step === 'recipient' ? (
          <Card className="w-full gap-0 px-4 py-0">
            {CONTACTS.map((c, i) => (
              <ListRow
                key={c.id}
                leading={
                  <Avatar alt={c.name} className="size-9">
                    <AvatarFallback>
                      <Text className="text-sm">{c.initials}</Text>
                    </AvatarFallback>
                  </Avatar>
                }
                title={c.name}
                subtitle={c.handle}
                chevron
                onPress={() => {
                  setRecipient(c);
                  setStep('review');
                }}
                last={i === CONTACTS.length - 1}
              />
            ))}
          </Card>
        ) : null}

        {step === 'review' && recipient ? (
          <View className="gap-5">
            <SummaryCard
              title="Review"
              rows={[
                { label: 'To', value: recipient.name },
                { label: 'Amount', value: money(value) },
                { label: 'Fee', value: '$0.00', valueClassName: 'text-success' },
                { label: 'Arrives', value: 'Instantly' },
              ]}
            />
            <SwipeToConfirm label={`Slide to send ${money(value)}`} onConfirm={() => setStep('done')} />
          </View>
        ) : null}
      </ScrollView>

      {step !== 'review' ? (
        <StickyBottomBar>
          {step === 'recipient' ? (
            <Button variant="outline" onPress={() => setStep('amount')}>
              <Text>Back</Text>
            </Button>
          ) : null}
          {step === 'amount' ? (
            <Button disabled={value <= 0} onPress={() => setStep('recipient')}>
              <Text>Continue</Text>
            </Button>
          ) : null}
        </StickyBottomBar>
      ) : null}
    </View>
  );
}
