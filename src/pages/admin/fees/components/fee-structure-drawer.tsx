import { CheckIcon, PlusIcon, TrashIcon } from "@heroicons/react/20/solid";

import { ChipsField, DateField, SelectField, TextField } from "@/shared/ui/form-fields";
import { Button } from "@/shared/ui/kit/button";
import { Checkbox } from "@/shared/ui/kit/checkbox";
import { Form } from "@/shared/ui/kit/form";
import { Sheet, SheetContent, SheetTitle } from "@/shared/ui/kit/sheet";
import { cn } from "@/shared/lib/utils";
import { formatMoney } from "@/shared/lib";
import useFeeStructuresController, { STRUCTURE_STEPS } from "../tabs/fee-structures-controller";

type Controller = ReturnType<typeof useFeeStructuresController>;

const StepHeading = ({ title, hint }: { title: string; hint: string }) => (
  <div>
    <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
    <p className="mt-0.5 text-sm text-gray-500">{hint}</p>
  </div>
);

const Total = ({ label, paise, warn }: { label: string; paise: number; warn?: string }) => (
  <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm">
    <span className={warn ? "text-red-600" : "text-gray-500"}>{warn ?? label}</span>
    <span className="font-semibold text-gray-900">{formatMoney(paise)}</span>
  </div>
);

// create or edit a fee structure in three short steps, from the right edge of the screen
const FeeStructureDrawer = ({ c }: { c: Controller }) => {
  const { form, items, installments, classIds, itemsTotal, installmentsTotal, installmentsError, editing } = c;
  const totalsMatch = itemsTotal === installmentsTotal;

  return (
    <Sheet open={c.isFormOpen} onOpenChange={(open) => !open && !c.isSaving && c.closeForm()}>
      <SheetContent side="right" className="max-w-2xl">
        <Form {...form}>
          <form
            noValidate
            className="flex min-h-0 flex-1 flex-col"
            // Enter moves on a step; only the last step saves
            onSubmit={(e) => {
              if (c.isLastStep) return c.onSubmit(e);
              e.preventDefault();
              c.goNext();
            }}
          >
            <div className="border-b border-gray-200 px-6 py-5 pr-12">
              <SheetTitle className="text-lg">{editing ? `Edit ${editing.name}` : "New fee structure"}</SheetTitle>
              {editing && (
                <p className="mt-1 text-sm text-gray-500">
                  Students already billed keep their amounts unless you move the ones who haven&apos;t paid yet.
                </p>
              )}
              <ol className="mt-5 flex items-center justify-center gap-3">
                {STRUCTURE_STEPS.map((s, index) => {
                  const done = index < c.step;
                  const current = index === c.step;
                  return (
                    <li key={s.title} className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => c.goToStep(index)}
                        aria-current={current ? "step" : undefined}
                        className="flex items-center gap-2 rounded-full py-1 pr-2 text-sm hover:bg-gray-50"
                      >
                        <span
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                            current && "bg-primary-600 text-white",
                            done && "bg-green-600 text-white",
                            !current && !done && "border border-gray-300 text-gray-500"
                          )}
                        >
                          {done ? <CheckIcon className="h-3.5 w-3.5" /> : index + 1}
                        </span>
                        <span className={cn(current ? "font-medium text-gray-900" : "text-gray-500")}>{s.title}</span>
                      </button>
                      {index < STRUCTURE_STEPS.length - 1 && <span className="h-px w-10 bg-gray-200" />}
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
              {c.step === 0 && (
                <>
                  <StepHeading title="Who it bills" hint="Name the structure and pick the classes it applies to." />
                  <TextField
                    form={form}
                    name="name"
                    label="Structure name"
                    placeholder="Class 9 Annual Fee"
                    autoFocus
                  />
                  <ChipsField
                    form={form}
                    name="classIds"
                    label="Classes"
                    options={c.classOptions}
                    emptyText="No active classes in the current year yet."
                    onToggle={c.onClassesChange}
                  />
                  <ChipsField
                    form={form}
                    name="sectionIds"
                    label="Sections (optional)"
                    description="Leave empty to bill every section of the classes above."
                    options={c.sectionOptions}
                    emptyText={classIds.length ? "These classes have no sections yet." : "Pick a class first."}
                  />
                </>
              )}

              {c.step === 1 && (
                <>
                  <StepHeading title="What it charges" hint="Each fee head and its amount for the year." />
                  {c.feeHeadOptions.length === 0 && !c.isLoadingFeeHeads && (
                    <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                      Create a fee head first on the Fee Heads tab, then pick it here.
                    </p>
                  )}
                  <div className="space-y-2">
                    {items.fields.map((row, index) => (
                      <div key={row.id} className="grid grid-cols-[1fr_10rem_auto] items-end gap-2">
                        <SelectField
                          form={form}
                          name={`items.${index}.feeHeadId`}
                          label="Fee head"
                          hideLabel={index > 0}
                          options={c.feeHeadOptions}
                        />
                        <TextField
                          form={form}
                          name={`items.${index}.amount`}
                          label="Amount (₹)"
                          hideLabel={index > 0}
                          type="number"
                          min={0}
                          step="0.01"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Remove item"
                          disabled={items.fields.length === 1}
                          onClick={() => items.remove(index)}
                        >
                          <TrashIcon className="h-4 w-4 text-gray-400" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => items.append({ feeHeadId: "", amount: "" })}>
                    <PlusIcon className="h-4 w-4" />
                    Add fee head
                  </Button>
                  <Total label="Total for the year" paise={itemsTotal} />
                </>
              )}

              {c.step === 2 && (
                <>
                  <StepHeading title="When it is due" hint="Split the total into instalments with due dates." />
                  <div className="space-y-2">
                    {installments.fields.map((row, index) => (
                      <div key={row.id} className="grid grid-cols-[1fr_10rem_8rem_auto] items-end gap-2">
                        <TextField
                          form={form}
                          name={`installments.${index}.label`}
                          label="Label"
                          hideLabel={index > 0}
                        />
                        <DateField
                          form={form}
                          name={`installments.${index}.dueDate`}
                          label="Due date"
                          hideLabel={index > 0}
                        />
                        <TextField
                          form={form}
                          name={`installments.${index}.amount`}
                          label="Amount (₹)"
                          hideLabel={index > 0}
                          type="number"
                          min={0}
                          step="0.01"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Remove installment"
                          disabled={installments.fields.length === 1}
                          onClick={() => installments.remove(index)}
                        >
                          <TrashIcon className="h-4 w-4 text-gray-400" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      installments.append({
                        label: `Installment ${installments.fields.length + 1}`,
                        dueDate: "",
                        amount: "",
                      })
                    }
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add instalment
                  </Button>
                  <Total
                    label="Instalments add up to"
                    paise={installmentsTotal}
                    warn={totalsMatch ? undefined : `Must add up to ${formatMoney(itemsTotal)}`}
                  />
                  {installmentsError && <p className="text-sm text-red-600">{installmentsError}</p>}

                  <div className="space-y-3 border-t border-gray-100 pt-5">
                    <StepHeading
                      title="Late fee (optional)"
                      hint="Added once to an instalment still unpaid this many days after its due date."
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <TextField
                        form={form}
                        name="lateFeeAmount"
                        label="Fine (₹)"
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="None"
                      />
                      <TextField
                        form={form}
                        name="lateFeeGraceDays"
                        label="Days after due date"
                        type="number"
                        min={0}
                        step="1"
                      />
                    </div>
                  </div>

                  {editing && (
                    <label className="flex items-start gap-2 rounded-lg border border-gray-200 p-3 text-sm text-gray-700">
                      <Checkbox
                        checked={c.applyToUnpaid}
                        onChange={(event) => c.setApplyToUnpaid(event.target.checked)}
                        className="mt-0.5"
                      />
                      <span>Also move students who haven&apos;t paid anything yet to these new amounts</span>
                    </label>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-6 py-3">
              <Button variant="secondary" onClick={c.step === 0 ? c.closeForm : c.goBack} disabled={c.isSaving}>
                {c.step === 0 ? "Cancel" : "Back"}
              </Button>
              <Button type="submit" loading={c.isSaving}>
                {!c.isLastStep ? "Next" : editing ? "Save changes" : "Create structure"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default FeeStructureDrawer;
