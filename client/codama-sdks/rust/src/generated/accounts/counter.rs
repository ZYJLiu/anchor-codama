//! This code was AUTOGENERATED using the codama library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun codama to update it.
//!
//! <https://github.com/codama-idl/codama>
//!

use borsh::BorshSerialize;
use borsh::BorshDeserialize;


#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, Eq, PartialEq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct Counter {
pub discriminator: [u8; 8],
pub count: u64,
}


impl Counter {
      pub const LEN: usize = 16;
  
  
  
  #[inline(always)]
  pub fn from_bytes(data: &[u8]) -> Result<Self, std::io::Error> {
    let mut data = data;
    Self::deserialize(&mut data)
  }
}

impl<'a> TryFrom<&solana_program::account_info::AccountInfo<'a>> for Counter {
  type Error = std::io::Error;

  fn try_from(account_info: &solana_program::account_info::AccountInfo<'a>) -> Result<Self, Self::Error> {
      let mut data: &[u8] = &(*account_info.data).borrow();
      Self::deserialize(&mut data)
  }
}

  #[cfg(feature = "anchor")]
  impl anchor_lang::AccountDeserialize for Counter {
      fn try_deserialize_unchecked(buf: &mut &[u8]) -> anchor_lang::Result<Self> {
        Ok(Self::deserialize(buf)?)
      }
  }

  #[cfg(feature = "anchor")]
  impl anchor_lang::AccountSerialize for Counter {}

  #[cfg(feature = "anchor")]
  impl anchor_lang::Owner for Counter {
      fn owner() -> Pubkey {
        crate::COUNTER_ID
      }
  }

  #[cfg(feature = "anchor-idl-build")]
  impl anchor_lang::IdlBuild for Counter {}

  
  #[cfg(feature = "anchor-idl-build")]
  impl anchor_lang::Discriminator for Counter {
    const DISCRIMINATOR: [u8; 8] = [0; 8];
  }

