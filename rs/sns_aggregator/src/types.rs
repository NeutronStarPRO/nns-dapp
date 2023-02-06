pub mod ic_sns_governance;
pub mod ic_sns_ledger;
pub mod ic_sns_root;
pub mod ic_sns_swap;
pub mod ic_sns_wasm;
pub mod slow;
pub mod state;

pub use ic_cdk::export::candid::{CandidType, Deserialize};
pub use ic_sns_governance::{GetMetadataResponse, ListNervousSystemFunctionsResponse};
pub use ic_sns_ledger::{Tokens as SnsTokens, Value as Icrc1Value};
pub use ic_sns_root::ListSnsCanistersResponse;
pub use ic_sns_swap::GetStateResponse;
pub use ic_sns_wasm::{DeployedSns, ListDeployedSnsesResponse, SnsCanisterIds};
use serde::Serialize;

/// A named empty record.
///
/// Many candid interfaces take an empty record as their argument.
/// Anonymous empty records are not handled correctly by didc, so we name them 'EmptyRecord'.
#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct EmptyRecord {}