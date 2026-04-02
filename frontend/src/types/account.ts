export interface Account {
  id: string;
  teller_account_id: string;
  institution_name: string | null;
  account_name: string | null;
  account_type: string | null;
  account_subtype: string | null;
  created_at: string | null;
}
