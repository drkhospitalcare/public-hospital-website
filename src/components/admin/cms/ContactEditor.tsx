"use client";

import { useState } from "react";
import { ContactInfoContent, PhoneContactItem, EmailContactItem, OperatingDayItem } from "@/types/cms";
import { Plus, Trash2, Phone, Mail, MessageCircle, Clock, MapPin, Check } from "lucide-react";

interface ContactEditorProps {
  contact: ContactInfoContent;
  setContact: React.Dispatch<React.SetStateAction<ContactInfoContent>>;
}

export default function ContactEditor({ contact, setContact }: ContactEditorProps) {
  const [activeTab, setActiveTab] = useState<
    "address" | "phones" | "whatsapp" | "emails" | "hours" | "visiting"
  >("address");

  // Phone handlers
  const handleAddPhone = () => {
    const newPhone: PhoneContactItem = {
      id: `phone-${Date.now()}`,
      label: "Support Helpline",
      number: "+91 44 0000 0000",
      raw: "+914400000000",
      isPrimary: false,
      isActive: true,
    };
    setContact({ ...contact, phoneNumbers: [...contact.phoneNumbers, newPhone] });
  };

  const handleRemovePhone = (id: string) => {
    setContact({
      ...contact,
      phoneNumbers: contact.phoneNumbers.filter((p) => p.id !== id),
    });
  };

  // Email handlers
  const handleAddEmail = () => {
    const newEmail: EmailContactItem = {
      id: `email-${Date.now()}`,
      label: "Department Email",
      email: "info@drkhospitals.com",
      isPrimary: false,
      isActive: true,
    };
    setContact({ ...contact, emails: [...contact.emails, newEmail] });
  };

  const handleRemoveEmail = (id: string) => {
    setContact({
      ...contact,
      emails: contact.emails.filter((e) => e.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#DCE8F0] pb-3">
        {[
          { id: "address", label: "A. Hospital Location", icon: MapPin },
          { id: "phones", label: "B. Phone Helplines", icon: Phone },
          { id: "whatsapp", label: "C. WhatsApp", icon: MessageCircle },
          { id: "emails", label: "D. Emails", icon: Mail },
          { id: "hours", label: "E. Operating Hours", icon: Clock },
          { id: "visiting", label: "F. Visiting Info", icon: Check },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition ${
                activeTab === tab.id
                  ? "bg-[#071B68] text-white shadow-xs"
                  : "bg-white text-[#5D6B85] hover:bg-[#EFFBFC] hover:text-[#071B68] border border-[#DCE8F0]"
              }`}
            >
              <Icon size={13} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* A. HOSPITAL LOCATION */}
      {activeTab === "address" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white space-y-4">
          <h3 className="text-lg font-bold text-[#071B68]">Hospital Location & Physical Address</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-[#071B68]">Hospital Official Name</label>
              <input
                type="text"
                value={contact.hospitalName}
                onChange={(e) => setContact({ ...contact, hospitalName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">Brand Tagline</label>
              <input
                type="text"
                value={contact.tagline}
                onChange={(e) => setContact({ ...contact, tagline: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#071B68]">Full Street Address</label>
            <textarea
              rows={2}
              value={contact.address}
              onChange={(e) => setContact({ ...contact, address: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white p-2.5 text-xs text-[#071B68]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <label className="text-xs font-bold text-[#071B68]">Locality / Area</label>
              <input
                type="text"
                value={contact.locality}
                onChange={(e) => setContact({ ...contact, locality: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">City</label>
              <input
                type="text"
                value={contact.city}
                onChange={(e) => setContact({ ...contact, city: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">State</label>
              <input
                type="text"
                value={contact.state}
                onChange={(e) => setContact({ ...contact, state: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">Postal PIN Code</label>
              <input
                type="text"
                value={contact.pincode}
                onChange={(e) => setContact({ ...contact, pincode: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
          </div>
        </div>
      )}

      {/* B. PHONE DIRECT CALL */}
      {activeTab === "phones" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#071B68]">Phone & Direct Call Numbers</h3>
              <p className="text-xs text-[#5D6B85]">
                Manage hospital helplines. The primary number is displayed in the header and top contact banner.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddPhone}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-[#071B68] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#087FBA]"
            >
              <Plus size={14} />
              <span>Add Phone</span>
            </button>
          </div>

          <div className="grid gap-3">
            {contact.phoneNumbers.map((ph, idx) => (
              <div
                key={ph.id}
                className="p-4 rounded-xl border border-[#DCE8F0] bg-[#F8FDFF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="grid gap-3 sm:grid-cols-2 flex-1 w-full">
                  <div>
                    <label className="text-[11px] font-bold text-[#071B68]">Label / Department</label>
                    <input
                      type="text"
                      value={ph.label}
                      onChange={(e) => {
                        const list = [...contact.phoneNumbers];
                        list[idx].label = e.target.value;
                        setContact({ ...contact, phoneNumbers: list });
                      }}
                      className="mt-1 w-full rounded-lg border border-[#DCE8F0] bg-white px-2.5 py-1.5 text-xs text-[#071B68]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#071B68]">Phone Number</label>
                    <input
                      type="text"
                      value={ph.number}
                      onChange={(e) => {
                        const list = [...contact.phoneNumbers];
                        list[idx].number = e.target.value;
                        list[idx].raw = e.target.value.replace(/[^0-9+]/g, "");
                        setContact({ ...contact, phoneNumbers: list });
                      }}
                      className="mt-1 w-full rounded-lg border border-[#DCE8F0] bg-white px-2.5 py-1.5 text-xs text-[#071B68] font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-[#071B68] cursor-pointer">
                    <input
                      type="radio"
                      name="primaryPhone"
                      checked={ph.isPrimary}
                      onChange={() => {
                        const list = contact.phoneNumbers.map((p) => ({
                          ...p,
                          isPrimary: p.id === ph.id,
                        }));
                        setContact({ ...contact, phoneNumbers: list });
                      }}
                    />
                    <span className="text-[11px] font-semibold">Primary</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-xs text-[#071B68] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ph.isActive}
                      onChange={(e) => {
                        const list = [...contact.phoneNumbers];
                        list[idx].isActive = e.target.checked;
                        setContact({ ...contact, phoneNumbers: list });
                      }}
                    />
                    <span className="text-[11px] font-semibold">Active</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleRemovePhone(ph.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* C. WHATSAPP */}
      {activeTab === "whatsapp" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white space-y-4">
          <h3 className="text-lg font-bold text-[#071B68]">WhatsApp Consultation Management</h3>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="waToggle"
              checked={contact.whatsapp.isEnabled}
              onChange={(e) =>
                setContact({
                  ...contact,
                  whatsapp: { ...contact.whatsapp, isEnabled: e.target.checked },
                })
              }
              className="h-4 w-4 rounded border-slate-300 text-[#087FBA]"
            />
            <label htmlFor="waToggle" className="text-xs font-bold text-[#071B68] cursor-pointer">
              Enable WhatsApp Contact Button across the website
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-[#071B68]">WhatsApp Number</label>
              <input
                type="text"
                value={contact.whatsapp.number}
                onChange={(e) =>
                  setContact({
                    ...contact,
                    whatsapp: {
                      ...contact.whatsapp,
                      number: e.target.value,
                      raw: e.target.value.replace(/[^0-9]/g, ""),
                    },
                  })
                }
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-mono text-[#071B68]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#071B68]">WhatsApp Button Text</label>
              <input
                type="text"
                value={contact.whatsapp.buttonText}
                onChange={(e) =>
                  setContact({
                    ...contact,
                    whatsapp: { ...contact.whatsapp, buttonText: e.target.value },
                  })
                }
                className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#071B68]">Default Pre-filled Message</label>
            <input
              type="text"
              value={contact.whatsapp.defaultMessage}
              onChange={(e) =>
                setContact({
                  ...contact,
                  whatsapp: { ...contact.whatsapp, defaultMessage: e.target.value },
                })
              }
              className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
            />
          </div>

          <div className="p-3 bg-[#EFFBFC] rounded-xl text-xs text-[#087FBA] font-mono break-all border border-[#DCE8F0]">
            Generated URL: https://wa.me/{contact.whatsapp.raw}?text=
            {encodeURIComponent(contact.whatsapp.defaultMessage)}
          </div>
        </div>
      )}

      {/* D. EMAILS */}
      {activeTab === "emails" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#071B68]">Official Email Addresses</h3>
            <button
              type="button"
              onClick={handleAddEmail}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-[#071B68] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#087FBA]"
            >
              <Plus size={14} />
              <span>Add Email</span>
            </button>
          </div>

          <div className="grid gap-3">
            {contact.emails.map((em, idx) => (
              <div
                key={em.id}
                className="p-4 rounded-xl border border-[#DCE8F0] bg-[#F8FDFF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="grid gap-3 sm:grid-cols-2 flex-1 w-full">
                  <div>
                    <label className="text-[11px] font-bold text-[#071B68]">Label</label>
                    <input
                      type="text"
                      value={em.label}
                      onChange={(e) => {
                        const list = [...contact.emails];
                        list[idx].label = e.target.value;
                        setContact({ ...contact, emails: list });
                      }}
                      className="mt-1 w-full rounded-lg border border-[#DCE8F0] bg-white px-2.5 py-1.5 text-xs text-[#071B68]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#071B68]">Email Address</label>
                    <input
                      type="email"
                      value={em.email}
                      onChange={(e) => {
                        const list = [...contact.emails];
                        list[idx].email = e.target.value;
                        setContact({ ...contact, emails: list });
                      }}
                      className="mt-1 w-full rounded-lg border border-[#DCE8F0] bg-white px-2.5 py-1.5 text-xs text-[#071B68]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-[#071B68] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={em.isActive}
                      onChange={(e) => {
                        const list = [...contact.emails];
                        list[idx].isActive = e.target.checked;
                        setContact({ ...contact, emails: list });
                      }}
                    />
                    <span className="text-[11px] font-semibold">Active</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(em.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* E. 7-DAY OPERATING HOURS */}
      {activeTab === "hours" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white space-y-4">
          <h3 className="text-lg font-bold text-[#071B68]">Hospital 7-Day Operating Hours</h3>
          <p className="text-xs text-[#5D6B85]">
            Set opening/closing timings for each day of the week. Updates automatically across the header, footer, and contact page.
          </p>

          <div className="divide-y divide-[#DCE8F0]">
            {contact.operatingHours.map((oh, idx) => (
              <div key={oh.day} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="w-28 font-bold text-xs text-[#071B68]">{oh.day}</div>

                <div className="flex items-center gap-3 flex-1">
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={oh.isOpen}
                      onChange={(e) => {
                        const list = [...contact.operatingHours];
                        list[idx].isOpen = e.target.checked;
                        setContact({ ...contact, operatingHours: list });
                      }}
                    />
                    <span className="text-xs font-semibold text-[#071B68]">
                      {oh.isOpen ? "Open" : "Closed"}
                    </span>
                  </label>

                  {oh.isOpen && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={oh.openTime}
                        onChange={(e) => {
                          const list = [...contact.operatingHours];
                          list[idx].openTime = e.target.value;
                          setContact({ ...contact, operatingHours: list });
                        }}
                        className="w-24 rounded-lg border border-[#DCE8F0] px-2 py-1 text-xs text-center font-mono"
                      />
                      <span className="text-xs text-[#5D6B85]">–</span>
                      <input
                        type="text"
                        value={oh.closeTime}
                        onChange={(e) => {
                          const list = [...contact.operatingHours];
                          list[idx].closeTime = e.target.value;
                          setContact({ ...contact, operatingHours: list });
                        }}
                        className="w-24 rounded-lg border border-[#DCE8F0] px-2 py-1 text-xs text-center font-mono"
                      />
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="Consultation notes / emergency note"
                    value={oh.note || ""}
                    onChange={(e) => {
                      const list = [...contact.operatingHours];
                      list[idx].note = e.target.value;
                      setContact({ ...contact, operatingHours: list });
                    }}
                    className="flex-1 rounded-lg border border-[#DCE8F0] px-2 py-1 text-xs text-[#5D6B85]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* F. VISITING INFO */}
      {activeTab === "visiting" && (
        <div className="card p-6 border border-[#DCE8F0] bg-white space-y-4">
          <h3 className="text-lg font-bold text-[#071B68]">Patient Visiting & Facility Guidance</h3>

          <div>
            <label className="text-xs font-bold text-[#071B68]">Walk-In Enquiry Guidance</label>
            <textarea
              rows={2}
              value={contact.visitingInfo.walkInInfo}
              onChange={(e) =>
                setContact({
                  ...contact,
                  visitingInfo: { ...contact.visitingInfo, walkInInfo: e.target.value },
                })
              }
              className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white p-2.5 text-xs text-[#071B68]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#071B68]">Visiting Instructions</label>
            <textarea
              rows={2}
              value={contact.visitingInfo.visitingInstructions}
              onChange={(e) =>
                setContact({
                  ...contact,
                  visitingInfo: { ...contact.visitingInfo, visitingInstructions: e.target.value },
                })
              }
              className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white p-2.5 text-xs text-[#071B68]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#071B68]">Accessibility Information</label>
            <textarea
              rows={2}
              value={contact.visitingInfo.accessibilityInfo}
              onChange={(e) =>
                setContact({
                  ...contact,
                  visitingInfo: { ...contact.visitingInfo, accessibilityInfo: e.target.value },
                })
              }
              className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white p-2.5 text-xs text-[#071B68]"
            />
          </div>
        </div>
      )}
    </div>
  );
}

