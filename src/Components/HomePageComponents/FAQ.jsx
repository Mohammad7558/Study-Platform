import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../Components/ui/accordion"

export function FAQ() {
  const faqs = [
    {
      question: "How do I sign up for the platform?",
      answer: "You can sign up by clicking the 'Sign Up' button in the top right corner of the page. You'll need to provide your email address and create a password."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, we offer a 14-day free trial for all new users. No credit card is required to start the trial."
    },
    {
      question: "What subjects are available on the platform?",
      answer: "We cover a wide range of subjects including Mathematics, Science, Literature, History, and Computer Science. New subjects are added regularly."
    },
    {
      question: "Can I download study materials for offline use?",
      answer: "Yes, most study materials are available for download in PDF format. Look for the download icon next to each resource."
    },
    {
      question: "How do I track my learning progress?",
      answer: "Your dashboard includes progress tracking for each course, showing completed lessons, quiz scores, and time spent studying."
    },
    {
      question: "Are the courses self-paced or scheduled?",
      answer: "All our courses are self-paced, allowing you to learn at your own convenience. However, some courses may have recommended timelines."
    }
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:pt-20 mt-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Find answers to common questions about our study platform.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl mt-12">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left hover:no-underline">
                  <h3 className="text-lg font-medium">{faq.question}</h3>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}